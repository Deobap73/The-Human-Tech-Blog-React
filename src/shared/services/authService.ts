// src/shared/services/authService.ts

import api from '../utils/axios';
import { safeApiPost } from '../utils/apiHelpers';
import { setAccessToken } from '../utils/authTokenStorage';

/**
 * Secure logout function.
 * Ensures CSRF token is fresh before POST to /auth/logout.
 * After logout, clears accessToken and redirects to home.
 */
export const logout = async (): Promise<void> => {
  try {
    console.log('[authService.logout] Initiating logout...');
    await api.get('/auth/csrf');
    console.log('[authService.logout] CSRF refreshed, proceeding...');
    await new Promise((res) => setTimeout(res, 100));
    await safeApiPost('/auth/logout');
    console.log('[authService.logout] Logout complete');
  } catch (err) {
    console.error('[authService.logout] Logout error:', err);
  } finally {
    setAccessToken('');
    window.location.href = '/';
  }
};

/**
 * Secure login function.
 * Uses safeApiPost to ensure CSRF token is fetched and included.
 * @param email - User's email address
 * @param password - User's password
 * @param captcha - reCAPTCHA token
 * @returns Response data from login endpoint
 */
export async function login(email: string, password: string, captcha: string): Promise<any> {
  // Perform POST /auth/login with CSRF protection
  return safeApiPost('/auth/login', { email, password, captcha });
}

/**
 * Secure register function.
 * Uses safeApiPost to include CSRF token automatically.
 * @param payload - Registration data
 */
export const register = (payload: any) => safeApiPost('/auth/register', payload);

// Commit: chore(authService): use safeApiPost for login to include CSRF token
