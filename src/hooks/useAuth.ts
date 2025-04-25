// The-Human-Tech-Blog-React/src/hooks/useAuth.ts

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContextDef';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
