// /src/shared/services/authService.ts

import api from '../utils/axios';
import { safeApiPost } from '../utils/apiHelpers';
import { setAccessToken } from '../utils/authTokenStorage';

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
 * After logout, clears accessToken and redirects to home (no more /login!).
 */
export const logout = async (): Promise<void> => {
  try {
    console.log('[authService.logout] Iniciando logout...');
    await api.get('/auth/csrf');
    console.log('[authService.logout] CSRF atualizado, aguardando...');
    await new Promise((res) => setTimeout(res, 100));
    await safeApiPost('/auth/logout');
    console.log('[authService.logout] Logout completo');
  } catch (err) {
    console.error('[authService.logout] Erro no logout:', err);
  } finally {
    setAccessToken('');
    // REDIRECT TO HOME, NOT /login
    window.location.href = '/';
  }
};

/**
 * Secure login function.
 * @param email
 * @param password
 */
export async function login(email: string, password: string, captcha: string) {
  // Agora envia o token captcha
  const res = await api.post('/auth/login', { email, password, captcha });
  return res.data;
}

/**
 * Secure register function.
 * @param payload
 */
export const register = (payload: RegisterPayload) => safeApiPost('/auth/register', payload);
