// src/shared/utils/csrf.ts

import api from './axios';

export async function ensureCsrfToken(): Promise<string> {
  const res = await api.get('/auth/csrf', { withCredentials: true });
  const csrfToken = res.data.csrfToken;
  if (!csrfToken) throw new Error('CSRF token not received from API');
  // Não precisas setar em headers, axios só vai buscar no cookie
  return csrfToken;
}

export function invalidateCsrfToken() {
  // Not implemented, kept for future use if needed.
}
