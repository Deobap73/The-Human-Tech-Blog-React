import axios from 'axios';
import { setAccessToken, getAccessToken } from './authTokenStorage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-CSRF-Token',
});

console.log(`[axios] API Base URL: ${api.defaults.baseURL}`); // Debug: Confirm base URL

let isRefreshing = false;
let failedQueue: any[] = [];

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

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log(
        `[axios] Request Interceptor: Token added to headers for ${config.method?.toUpperCase()} ${
          config.url
        }`
      ); // Debug: Token added
    } else {
      console.log(
        `[axios] Request Interceptor: No token found for ${config.method?.toUpperCase()} ${
          config.url
        }`
      ); // Debug: No token
    }
    return config;
  },
  (requestError) => {
    console.error('[axios] Request Interceptor Error:', requestError); // Debug: Request error
    return Promise.reject(requestError);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(
      `[axios] Response Interceptor: Successful response from ${response.config.method?.toUpperCase()} ${
        response.config.url
      }`
    ); // Debug: Successful response
    if (response.data) {
      console.log('[axios] Response Data Table:');
      console.table(response.data); // Debug: Table view of response data
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.warn(
      `[axios] Response Interceptor: Error received from ${originalRequest.method?.toUpperCase()} ${
        originalRequest.url
      } - Status: ${error.response?.status}`
    ); // Debug: Error received

    // Limit only one retry
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      console.log('[axios] 401 Unauthorized, attempting token refresh...'); // Debug: Starting refresh
      if (isRefreshing) {
        // Queue requests during refresh
        console.log('[axios] Refresh already in progress, queuing request...'); // Debug: Queuing
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            console.log('[axios] Retrying original request with new token from queue.'); // Debug: Retrying from queue
            return api(originalRequest);
          })
          .catch((err) => {
            console.error('[axios] Failed to retry original request from queue:', err); // Debug: Retry failed from queue
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      console.log('[axios] Initiating new token refresh request...'); // Debug: New refresh request

      try {
        const res = await api.post('/auth/refresh');
        const { accessToken } = res.data;
        setAccessToken(accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        console.log('[axios] Token refreshed successfully. New Access Token set.'); // Debug: Refresh successful
        console.log('[axios] New Access Token Data Table:');
        console.table(res.data); // Debug: Table view of refresh token response
        processQueue(null, accessToken);
        isRefreshing = false;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        console.log('[axios] Retrying original request with newly refreshed token.'); // Debug: Retrying original
        return api(originalRequest);
      } catch (refreshError) {
        console.error('[axios] Token refresh failed:', refreshError); // Debug: Refresh failed
        processQueue(refreshError, null);
        isRefreshing = false;
        // Remove access token if refresh fails
        localStorage.removeItem('access_token');
        console.warn('[axios] Access token removed from localStorage due to failed refresh.'); // Debug: Token removed
        // Here you can emit a global event or call a function to force logout and show login.
        // Example: window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    console.error(
      '[axios] Response Interceptor: Request error not handled by 401 retry logic or already retried.',
      error
    ); // Debug: Unhandled error
    return Promise.reject(error);
  }
);

export default api;
