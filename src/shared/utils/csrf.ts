// src/shared/utils/csrf.ts

import api from './axios';

// Remove o cache local
export async function ensureCsrfToken(): Promise<string> {
  const res = await api.get('/auth/csrf', { withCredentials: true });
  const csrfToken = res.data.csrfToken;

  if (!csrfToken) {
    throw new Error('CSRF token not received from API');
  }

  // O header será lido do cookie pelo interceptor do Axios, mas podemos também definir explicitamente:
  api.defaults.headers.common['X-CSRF-Token'] = csrfToken;

  return csrfToken;
}

export function invalidateCsrfToken() {
  // Não há mais cache, função opcionalmente removida.
}
