// /src/shared/hooks/useAuth.ts

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api, { ensureCsrfToken } from '../utils/axios';

/**
 * Custom Auth hook for authentication actions.
 * Ensures CSRF token is present before login to avoid any race condition.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  /**
   * Login function with reCAPTCHA and CSRF validation.
   * Ensures CSRF cookie is available before POST request.
   */
  const login = async (email: string, password: string, captcha: string) => {
    // 1. Ensure CSRF token is available in cookie (will block if not yet present)
    await ensureCsrfToken();

    // 2. Call login endpoint. Axios interceptor adds X-CSRF-Token automatically.
    const res = await api.post('/auth/login', { email, password, captcha });

    // TODO: Handle storing tokens/context update as needed by your AuthContext.
    return res;
  };

  return { ...context, login };
};
