// /src/shared/services/authService.ts

import api from '../utils/axios';
import { ensureCsrfToken } from '../utils/csrf';

export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
  [key: string]: any;
}

/**
 * Calls the logout endpoint.
 */
export const logout = async (): Promise<void> => {
  await ensureCsrfToken(); // Always ensure CSRF for mutating requests!
  await api.post('/auth/logout');
};

/**
 * Calls the login endpoint, ensuring a valid CSRF token is set before the request.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns API response data with accessToken and message.
 */
export const login = async (email: string, password: string) => {
  await ensureCsrfToken(); // Ensure CSRF token is available and valid before login
  return api.post('/auth/login', { email, password }).then((res) => res.data);
};

/**
 * Calls the register endpoint, ensuring a valid CSRF token is set before the request.
 * @param payload - Registration data.
 * @returns API response data.
 */
export const register = async (payload: RegisterPayload) => {
  await ensureCsrfToken(); // Always ensure CSRF for mutating requests!
  return api.post('/auth/register', payload).then((res) => res.data);
};
