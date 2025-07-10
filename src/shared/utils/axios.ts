// /src/shared/utils/axios.ts

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { setAccessToken, getAccessToken, removeAccessToken } from './authTokenStorage';

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
 * Ensures that the CSRF token cookie (XSRF-TOKEN) is present before any mutating request.
 * This function will poll for the cookie for up to 1 second (10 tries, 100ms each)
 * to guarantee it is set in the browser before any POST/PUT/DELETE request is sent.
 * Throws an error if the token is still not found after 1 second.
 */
export const ensureCsrfToken = async (): Promise<void> => {
  let attempts = 0;
  let xsrfToken = getCookie('XSRF-TOKEN');
  if (xsrfToken) return;

  // Request the CSRF token from the backend.
  await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/csrf`, {
    withCredentials: true,
  });

  // Wait until the XSRF-TOKEN cookie is available (poll up to 1s).
  while (!getCookie('XSRF-TOKEN') && attempts < 10) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    attempts++;
  }

  xsrfToken = getCookie('XSRF-TOKEN');
  if (!xsrfToken) {
    throw new Error('[CSRF] XSRF-TOKEN cookie not found after requesting /auth/csrf');
  }
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

// Axios Request Interceptor: Adds Authorization & CSRF token (guaranteed by ensureCsrfToken)
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // For mutating requests, CSRF token must exist (ensureCsrfToken will handle before usage)
    const method = config.method?.toLowerCase();
    if (['post', 'put', 'patch', 'delete'].includes(method || '')) {
      const xsrfToken = getCookie('XSRF-TOKEN');
      if (xsrfToken) {
        config.headers = config.headers || {};
        config.headers['x-csrf-token'] = xsrfToken;
      }
      if (import.meta.env.DEV) {
        console.log('[Axios] Preparing mutating request:', {
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
  (requestError) => {
    if (import.meta.env.DEV) {
      console.error('[axios] Request Interceptor Error:', requestError);
    }
    return Promise.reject(requestError);
  }
);

// Axios Response Interceptor: Handles 401 errors and refreshes access token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 Unauthorized and not already retried, try refresh
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue requests while refreshing
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers)
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try refresh token: expects refresh token in HttpOnly cookie!
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/refresh-token`,
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

    // Other errors: just propagate
    return Promise.reject(error);
  }
);

export default api;
