// src/shared/utils/apiHelpers.ts

import api from './axios';
import { ensureCsrfToken } from './csrf';

// Helper para POST seguro com CSRF
export async function safeApiPost<T>(url: string, data?: any) {
  await ensureCsrfToken();
  // Espera para garantir que o cookie foi realmente setado (sincronização browser)
  await new Promise((res) => setTimeout(res, 60));
  return api.post<T>(url, data).then((res) => res.data);
}

// Helper para PUT seguro com CSRF
export async function safeApiPut<T>(url: string, data?: any) {
  await ensureCsrfToken();
  await new Promise((res) => setTimeout(res, 60));
  return api.put<T>(url, data).then((res) => res.data);
}

// Helper para DELETE seguro com CSRF
export async function safeApiDelete<T>(url: string) {
  await ensureCsrfToken();
  await new Promise((res) => setTimeout(res, 60));
  return api.delete<T>(url).then((res) => res.data);
}
