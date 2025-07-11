// src/shared/hooks/useAuth.ts

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { login as loginService } from '../services/authService';
import { setAccessToken } from '../utils/authTokenStorage';

/**
 * Custom Auth hook for authentication actions.
 * Calls authService.login, stores access token and updates AuthContext.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  /**
   * Login function with reCAPTCHA and CSRF validation.
   * Ensures CSRF cookie is handled by authService and captcha by middleware.
   */
  const login = async (email: string, password: string, captcha: string) => {
    // 1. Call backend login endpoint
    const data = await loginService(email, password, captcha);

    // 2. Store access token (so axios will include it on future requests)
    if (data.accessToken) {
      setAccessToken(data.accessToken);
    }

    // 3. Update AuthContext user state if the controller returns user info
    if (context.setUser && data.user) {
      context.setUser(data.user);
    }

    return data;
  };

  return { ...context, login };
};
