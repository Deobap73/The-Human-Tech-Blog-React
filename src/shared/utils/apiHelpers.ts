// /src/shared/utils/apiHelpers.ts

import api from './axios';
import { ensureCsrfToken } from './csrf';

/**
 * Helper to read a cookie by name in the browser.
 */
function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

/**
 * Secure POST with CSRF token in header.
 */
export async function safeApiPost<T>(url: string, data?: any) {
  await ensureCsrfToken();
  let xsrfToken = getCookie('XSRF-TOKEN');
  // Wait up to 100ms if cookie is not yet present
  let waitCount = 0;
  while (!xsrfToken && waitCount < 10) {
    await new Promise((res) => setTimeout(res, 10));
    xsrfToken = getCookie('XSRF-TOKEN');
    waitCount++;
  }
  return api
    .post<T>(url, data, {
      headers: xsrfToken ? { 'x-csrf-token': xsrfToken } : {},
    })
    .then((res) => res.data);
}

/**
 * Secure PUT with CSRF token in header.
 */
export async function safeApiPut<T>(url: string, data?: any) {
  await ensureCsrfToken();
  let xsrfToken = getCookie('XSRF-TOKEN');
  let waitCount = 0;
  while (!xsrfToken && waitCount < 10) {
    await new Promise((res) => setTimeout(res, 10));
    xsrfToken = getCookie('XSRF-TOKEN');
    waitCount++;
  }
  return api
    .put<T>(url, data, {
      headers: xsrfToken ? { 'x-csrf-token': xsrfToken } : {},
    })
    .then((res) => res.data);
}

/**
 * Secure DELETE with CSRF token in header.
 */
export async function safeApiDelete<T>(url: string) {
  await ensureCsrfToken();
  let xsrfToken = getCookie('XSRF-TOKEN');
  let waitCount = 0;
  while (!xsrfToken && waitCount < 10) {
    await new Promise((res) => setTimeout(res, 10));
    xsrfToken = getCookie('XSRF-TOKEN');
    waitCount++;
  }
  return api
    .delete<T>(url, {
      headers: xsrfToken ? { 'x-csrf-token': xsrfToken } : {},
    })
    .then((res) => res.data);
}
