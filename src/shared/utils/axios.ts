// /src/shared/utils/axios.ts

import axios from 'axios';
import { setAccessToken, getAccessToken } from './authTokenStorage';

// Utility to read cookies (browser)
const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
};

// Pede novo CSRF token se necessário
const ensureCsrfToken = async (): Promise<void> => {
  if (!getCookie('XSRF-TOKEN')) {
    try {
      await axios.get(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/csrf`,
        { withCredentials: true }
      );
      // Depois deste GET, o cookie XSRF-TOKEN será criado automaticamente.
    } catch (err) {
      console.error('[Axios] Failed to refresh CSRF token:', err);
    }
  }
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-CSRF-Token',
});

// --- Axios Request Interceptor ---
api.interceptors.request.use(
  async (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // CSRF token para requests mutáveis
    const method = config.method?.toLowerCase();
    if (['post', 'put', 'patch', 'delete'].includes(method || '')) {
      await ensureCsrfToken(); // Garante que existe o token
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
    // Não faz refresh automático! (proteção contra loop)
    return Promise.reject(error);
  }
);

export default api;
