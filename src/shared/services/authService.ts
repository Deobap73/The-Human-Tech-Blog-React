// The-Human-Tech-Blog-React\src\shared\services\authService.ts

import api from '../utils/axios';
import { safeApiPost } from '../utils/apiHelpers';
import { ensureCsrfToken } from '../utils/csrf';

/**
 * Interface for register payload.
 */
export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
  [key: string]: any;
}

/**
 * Secure logout function.
 * Ensures CSRF token is fresh before POST to /auth/logout.
 */
export const logout = async (): Promise<void> => {
  console.log('[authService.logout] Iniciando logout...');
  await api.get('/auth/csrf'); // Corrigido: sem '/api'
  console.log('[authService.logout] CSRF atualizado, aguardando...');
  await new Promise((res) => setTimeout(res, 100));
  console.log('[authService.logout] POST /auth/logout prestes a ser enviado');
  await safeApiPost('/auth/logout');
  console.log('[authService.logout] Logout completo');
};

/**
 * Secure login function.
 * @param email
 * @param password
 */
export const login = (email: string, password: string) =>
  safeApiPost('/auth/login', { email, password });

/**
 * Secure register function.
 * @param payload
 */
export const register = (payload: RegisterPayload) => safeApiPost('/auth/register', payload);
