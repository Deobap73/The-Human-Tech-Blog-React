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
 * After logout, clears accessToken and redirects to /login (preventing any refresh loop).
 */
export const logout = async (): Promise<void> => {
  try {
    console.log('[authService.logout] Iniciando logout...');
    // Garantir CSRF token atualizado antes do POST logout
    await api.get('/auth/csrf');
    console.log('[authService.logout] CSRF atualizado, aguardando...');
    await new Promise((res) => setTimeout(res, 100));
    // Logout na API
    await safeApiPost('/auth/logout');
    console.log('[authService.logout] Logout completo');
  } catch (err) {
    // Mesmo em erro, força limpeza local!
    console.error('[authService.logout] Erro no logout:', err);
  } finally {
    // Limpa accessToken local e força redirect (evita loops)
    setAccessToken('');
    // Limpa outros estados se usares context/redux
    window.location.href = '/login';
  }
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
