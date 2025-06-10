// /src/shared/utils/axios.ts

import axios from 'axios';
import { setAccessToken, getAccessToken } from './authTokenStorage';

/**
 * Axios instance with CSRF and JWT integration for secure API communication.
 * Ensures CSRF token is sent in the header for mutating requests (POST, PUT, PATCH, DELETE).
 */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN', // For compatibility, not strictly necessary
  xsrfHeaderName: 'X-CSRF-Token',
});

// Utility function to read a cookie by name
const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
};

let isRefreshing = false;
let failedQueue: any[] = [];

// Handles queue of failed requests while refreshing access token
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    // Attach JWT token if available
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Inject CSRF token for mutating requests
    const method = config.method?.toLowerCase();
    if (['post', 'put', 'patch', 'delete'].includes(method || '')) {
      const xsrfToken = getCookie('XSRF-TOKEN');
      if (xsrfToken) {
        config.headers = config.headers || {};
        config.headers['x-csrf-token'] = xsrfToken;
      }
    }
    return config;
  },
  (requestError) => {
    console.error('[axios] Request Interceptor Error:', requestError);
    return Promise.reject(requestError);
  }
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle expired token flow (401) with refresh logic
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const res = await api.post('/auth/refresh');
        const { accessToken } = res.data;
        setAccessToken(accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        isRefreshing = false;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        localStorage.removeItem('access_token');
        // Optionally trigger global logout event here
        return Promise.reject(refreshError);
      }
    }
    // Final fallback: propagate error
    return Promise.reject(error);
  }
);

export default api;
