// src/shared/utils/axios.ts

import axios from 'axios';
import { setAccessToken, getAccessToken } from './authTokenStorage';

// Utility to read cookies
const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
};

// Patch: Function to ensure CSRF cookie before mutating requests
export async function ensureCsrfToken() {
  // Only set if cookie does not exist
  if (!getCookie('XSRF-TOKEN')) {
    try {
      await axios.get(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/csrf`,
        { withCredentials: true }
      );
      // Now the XSRF-TOKEN cookie should be set
    } catch (e) {
      // Optionally handle error
      console.error('[ensureCsrfToken] Failed to get CSRF cookie', e);
    }
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-CSRF-Token',
});

api.interceptors.request.use(
  async (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Ensure CSRF token is present for mutating requests
    const method = config.method?.toLowerCase();
    if (['post', 'put', 'patch', 'delete'].includes(method || '')) {
      // Wait for CSRF cookie if not present
      if (!getCookie('XSRF-TOKEN')) {
        await ensureCsrfToken();
      }
      const xsrfToken = getCookie('XSRF-TOKEN');
      if (xsrfToken) {
        config.headers = config.headers || {};
        config.headers['x-csrf-token'] = xsrfToken;
      }
      // DEBUG log
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
        // Refresh the access token with the refresh token (httpOnly cookie)
        await ensureCsrfToken(); // guarantee CSRF before refresh
        const refreshResponse = await api.post('/auth/refresh', null, {
          withCredentials: true,
        });
        const { accessToken } = refreshResponse.data;

        if (accessToken) {
          setAccessToken(accessToken);
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        // Repeat the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout and redirect to login
        console.error('[axios] Token refresh failed, redirecting to login');
        setAccessToken('');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
