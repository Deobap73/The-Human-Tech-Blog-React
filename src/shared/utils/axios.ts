// src/shared/utils/axios.ts
import axios from 'axios';
import { getAccessToken } from './authTokenStorage';

let csrfToken: string | null = null;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-CSRF-Token',
});

api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase() ?? 'get';

  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  if (!['get', 'head', 'options'].includes(method)) {
    if (!csrfToken) {
      try {
        const { data } = await axios.get('/auth/csrf', {
          baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
          withCredentials: true,
        });
        csrfToken = data.csrfToken;
      } catch (err) {
        console.error('❌ Could not retrieve CSRF token', err);
        throw err;
      }
    }
    config.headers['X-CSRF-Token'] = csrfToken;
  }

  return config;
});

export default api;
