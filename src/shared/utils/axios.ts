// src/shared/utils/axios.ts

import axios from 'axios';
import { setAccessToken, getAccessToken } from './authTokenStorage';

// Utility to read cookies (browser)
const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-CSRF-Token',
});

// --- Axios Request Interceptor ---
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // CSRF token for mutating requests
    const method = config.method?.toLowerCase();
    if (['post', 'put', 'patch', 'delete'].includes(method || '')) {
      const xsrfToken = getCookie('XSRF-TOKEN');
      if (xsrfToken) {
        config.headers = config.headers || {};
        config.headers['x-csrf-token'] = xsrfToken;
      }
      // Debug
      console.log('[Axios] Preparing mutating request:', {
        method,
        url: config.url,
        xsrfToken,
        headers: config.headers,
        cookies: document.cookie,
      });
    }
    return config;
  },
  (requestError) => {
    console.error('[axios] Request Interceptor Error:', requestError);
    return Promise.reject(requestError);
  }
);

// --- Axios Response Interceptor (loop protection) ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Prevent infinite loop: Only try refresh if not already tried AND if not logging out!
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !window.location.pathname.startsWith('/login') &&
      !window.location.pathname.startsWith('/logout')
    ) {
      originalRequest._retry = true;

      // Não tenta refresh se não existir refreshToken no cookie!
      const hasRefreshToken = !!getCookie('refreshToken');
      if (!hasRefreshToken) {
        setAccessToken('');
        // Redireciona, não tenta novamente
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await api.post('/auth/refresh', null, {
          withCredentials: true,
        });
        const { accessToken } = refreshResponse.data;
        if (accessToken) {
          setAccessToken(accessToken);
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken('');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
