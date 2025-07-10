// /src/shared/hooks/useAuth.ts

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  /**
   * Login with reCAPTCHA
   */
  const login = async (email: string, password: string, captcha: string) => {
    const res = await api.post('/auth/login', { email, password, captcha });
    // Handle storing tokens, etc, as per your original AuthContext logic
    // ...
  };

  return { ...context, login };
};
