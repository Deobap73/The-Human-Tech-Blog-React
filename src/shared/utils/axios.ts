// src/shared/utils/axios.ts

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { setAccessToken, getAccessToken, removeAccessToken } from './authTokenStorage';
import { ensureCsrfToken } from './csrf';

/**
 * Utility to read cookies in the browser.
 * Returns the value of a cookie by name.
 */
const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
};

/**
 * Custom Axios instance with interceptors for Auth and CSRF.
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

// Axios Request Interceptor: Adds Authorization & CSRF token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Ensure Authorization header
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // For mutating requests, ensure CSRF token before proceeding
    const method = config.method?.toLowerCase();
    if (['post', 'put', 'patch', 'delete'].includes(method || '')) {
      await ensureCsrfToken();
      const xsrfToken = getCookie('XSRF-TOKEN');
      if (xsrfToken) {
        config.headers = config.headers || {};
        config.headers['x-csrf-token'] = xsrfToken;
      }
      if (import.meta.env.DEV) {
        console.log('[Axios] Mutating request:', {
          method,
          url: config.url,
          xsrfToken,
          headers: config.headers,
          cookies: document.cookie,
        });
      }
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
