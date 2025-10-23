// /src/shared/services/csrfService.ts
'use strict';

/**
 * CSRF service (client)
 * - Prefer canonical endpoint /auth/csrf
 * - Fallback to /csrf-token and /csrf/token for legacy compatibility
 * - Caches token in-memory to avoid redundant roundtrips
 */

import api from '../utils/axios';

let cachedToken: string | null = null;

export function getCsrfToken(): string | null {
  return cachedToken;
}

export async function ensureCsrf(): Promise<string> {
  // Return from cache if we have a non-empty token
  if (cachedToken && cachedToken.length > 0) return cachedToken;

  // 1) Canonical endpoint
  try {
    const res = await api.get<{ csrfToken?: string; token?: string }>('/auth/csrf', {
      params: { _ts: Date.now() },
      withCredentials: true,
    });
    const token = res.data?.csrfToken || res.data?.token || '';
    if (token) {
      cachedToken = token;
      return token;
    }
  } catch {
    // ignore and fallback
  }

  // 2) Legacy endpoint: /csrf-token
  try {
    const res = await api.get<{ csrfToken?: string; token?: string }>('/csrf-token', {
      params: { _ts: Date.now() },
      withCredentials: true,
    });
    const token = res.data?.csrfToken || res.data?.token || '';
    if (token) {
      cachedToken = token;
      return token;
    }
  } catch {
    // ignore and fallback
  }

  // 3) Legacy endpoint: /csrf/token
  const res = await api.get<{ csrfToken?: string; token?: string }>('/csrf/token', {
    params: { _ts: Date.now() },
    withCredentials: true,
  });
  const token = res.data?.csrfToken || res.data?.token || '';
  if (!token) {
    throw new Error('CSRF token endpoint did not return a token.');
  }

  cachedToken = token;
  return token;
}

export function setCsrfToken(token: string | null): void {
  cachedToken = token;
}
