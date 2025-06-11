// src/shared/services/authService.ts

import api from '../utils/axios';
import { safeApiPost } from '../utils/apiHelpers';

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
  await api.get('/csrf'); // Atualiza CSRF token no cookie antes de logout
  await safeApiPost('/auth/logout');
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
