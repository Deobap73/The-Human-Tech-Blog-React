// ./src/shared/utils/axios.ts
'use strict';

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { setAccessToken, getAccessToken, removeAccessToken } from './authTokenStorage';

/**
 * Custom Axios instance with interceptors for Auth.
 * CSRF is handled by service helpers that explicitly fetch /auth/csrf.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'x-csrf-token',
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token as string);
  });
  failedQueue = [];
};

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (requestError) => Promise.reject(requestError),
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            if (originalRequest.headers)
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
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
          { withCredentials: true },
        );

        const { accessToken } = res.data as { accessToken?: unknown };

        if (typeof accessToken === 'string' && accessToken.trim().length > 0) {
          setAccessToken(accessToken);
          processQueue(null, accessToken);

          if (originalRequest.headers)
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return api(originalRequest);
        }

        processQueue(new Error('No access token in refresh response'), null);
        removeAccessToken();
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(error);
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
  },
);

export default api;
