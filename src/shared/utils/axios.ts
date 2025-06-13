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

// JWT and debug
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

// Response interceptor (JWT refresh logic, unchanged)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // ... [keep your original refresh logic here]
    return Promise.reject(error);
  }
);

export default api;
