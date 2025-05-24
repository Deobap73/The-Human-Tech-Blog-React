// src/shared/context/AuthProvider.tsx

import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import api from '../utils/axios';
import { setAccessToken, getAccessToken } from '../utils/authTokenStorage';
import { User } from './AuthContextDef';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Atualiza user
  const refetchUser = async (): Promise<void> => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Busca e usa o CSRF token antes de qualquer POST
  const getCsrfToken = async (): Promise<string> => {
    const { data } = await api.get('/auth/csrf');
    return data.csrfToken;
  };

  // Usa refresh token no cookie para obter accessToken novo
  const refreshAccessToken = async (): Promise<void> => {
    const csrfToken = await getCsrfToken();
    const res = await api.post('/auth/refresh', {}, { headers: { 'X-CSRF-Token': csrfToken } });
    const { accessToken } = res.data;
    setAccessToken(accessToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  };

  // Se precisares, podes adaptar esta função também para usar CSRF
  const getAccessTokenSecurely = async (): Promise<void> => {
    const csrfToken = await getCsrfToken();
    const res = await api.post('/auth/token', {}, { headers: { 'X-CSRF-Token': csrfToken } });
    const { accessToken } = res.data;
    if (accessToken) {
      setAccessToken(accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    const csrfToken = await getCsrfToken();
    const res = await api.post(
      '/auth/login',
      { email, password },
      { headers: { 'X-CSRF-Token': csrfToken } }
    );
    const { accessToken } = res.data;
    setAccessToken(accessToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await refetchUser();
  };

  const logout = async (): Promise<void> => {
    const csrfToken = await getCsrfToken();
    await api.post('/auth/logout', {}, { headers: { 'X-CSRF-Token': csrfToken } });
    localStorage.removeItem('access_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Inicializa sessão ao abrir a app
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        if (getAccessToken()) {
          await refetchUser();
        } else {
          await refreshAccessToken();
          await refetchUser();
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    void init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        login,
        logout,
        refetchUser,
        getAccessTokenSecurely,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
