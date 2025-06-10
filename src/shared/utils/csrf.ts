// src/shared/utils/csrf.ts

import api from './axios';

let csrfToken: string | null = null;

export async function ensureCsrfToken(): Promise<string> {
  if (csrfToken) {
    return csrfToken;
  }

  const res = await api.get('/auth/csrf', { withCredentials: true });

  csrfToken = res.data.csrfToken;

  if (csrfToken === null) {
    throw new Error('CSRF token not received from API');
  }

  api.defaults.headers.common['X-CSRF-Token'] = csrfToken;

  return csrfToken;
}

export function invalidateCsrfToken() {
  csrfToken = null;
}
