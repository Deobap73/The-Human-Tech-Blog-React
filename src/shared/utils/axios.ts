// /src/shared/utils/axios.ts

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { setAccessToken, getAccessToken, removeAccessToken } from './authTokenStorage';
import { useLoginModal } from '../hooks/useLoginModal'; // Só para tipos – NÃO usar hook aqui

// Utility to read cookies (browser)
const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
};

const ensureCsrfToken = async (): Promise<void> => {
  if (!getCookie('XSRF-TOKEN')) {
    try {
      await axios.get(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/csrf`,
        { withCredentials: true }
      );
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('[Axios] Failed to refresh CSRF token:', err);
      }
    }
  }
};

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

// --- Axios Request Interceptor ---
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // CSRF token para requests mutáveis
    const method = config.method?.toLowerCase();
    if (['post', 'put', 'patch', 'delete'].includes(method || '')) {
      await ensureCsrfToken();
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

// --- Axios Response Interceptor COM REFRESH AUTOMÁTICO ---
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Se der 401 e ainda não tentámos refresh...
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Já está a refrescar, adiciona request à fila e espera
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
        // Faz refresh token: o refresh token DEVE estar no cookie HttpOnly!
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
          window.dispatchEvent(new CustomEvent('auth:logout')); // Podes escutar isto para abrir modal
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

    // Outro erro: devolve normalmente
    return Promise.reject(error);
  }
);

export default api;
