// src/shared/utils/axios.ts

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { setAccessToken, getAccessToken, removeAccessToken } from './authTokenStorage';

/**
 * Custom Axios instance with interceptors for Auth.
 * CSRF is handled only via helpers, not here!
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-CSRF-Token',
});

// Flag to prevent infinite refresh loops
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Axios Request Interceptor: Adds Authorization only!
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (requestError) => Promise.reject(requestError)
);

// Axios Response Interceptor: Handles 401 errors and refreshes access token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 and not retried, attempt refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            if (originalRequest.headers)
              originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const { accessToken } = res.data;
        if (accessToken) {
          setAccessToken(accessToken);
          processQueue(null, accessToken);
          if (originalRequest.headers)
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return api(originalRequest);
        } else {
          processQueue(new Error('No access token in refresh response'), null);
          removeAccessToken();
          window.dispatchEvent(new CustomEvent('auth:logout'));
          return Promise.reject(error);
        }
      } catch (err) {
        processQueue(err, null);
        removeAccessToken();
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
