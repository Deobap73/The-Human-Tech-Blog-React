// src/shared/utils/axios.ts

import axios from 'axios';
import { setAccessToken, getAccessToken } from './authTokenStorage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-CSRF-Token',
});

// Utility to read cookies
const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
};

// Request interceptor (mantém igual)
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // DEBUG log for mutating requests
    const method = config.method?.toLowerCase();
    if (['post', 'put', 'patch', 'delete'].includes(method || '')) {
      const xsrfToken = getCookie('XSRF-TOKEN');
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

// RESPONSE INTERCEPTOR: Automatic token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Tenta refrescar o access token com o refresh token (cookie httpOnly)
        const refreshResponse = await api.post('/auth/refresh', null, {
          withCredentials: true,
        });
        const { accessToken } = refreshResponse.data;

        if (accessToken) {
          setAccessToken(accessToken); // Atualiza storage local
          // Atualiza o header do request original
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        // Repete o request original (resolve para quem chamou)
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh falhou - logout, redireciona para login, etc
        console.error('[axios] Token refresh failed, redirecting to login');
        // Opcional: Limpar token
        setAccessToken('');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
