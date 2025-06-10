// src/shared/services/authService.ts

import api from '../utils/axios';
import { safeApiPost } from '../utils/apiHelpers';

export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
  [key: string]: any;
}

export const logout = (): Promise<void> => safeApiPost('/auth/logout');
export const login = (email: string, password: string) =>
  safeApiPost('/auth/login', { email, password });

export const register = (payload: RegisterPayload) => safeApiPost('/auth/register', payload);
