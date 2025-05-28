// src/shared/context/AuthProvider.tsx

import { useState, useEffect, useRef } from 'react';
import { AuthContext } from './AuthContext';
import api from '../utils/axios';
import { setAccessToken, getAccessToken } from '../utils/authTokenStorage';
import { User } from './AuthContextDef';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const loadingReleased = useRef(false);

  // Atualiza user
  const refetchUser = async (): Promise<void> => {
    console.log('[AuthProvider] refetchUser() called');
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
      console.log('[AuthProvider] refetchUser() success:', res.data.user);
    } catch (err) {
      setUser(null);
      console.warn('[AuthProvider] refetchUser() failed:', err);
    }
  };

  const getCsrfToken = async (): Promise<string> => {
    console.log('[AuthProvider] getCsrfToken() called');
    const { data } = await api.get('/auth/csrf');
    console.log('[AuthProvider] getCsrfToken() success:', data.csrfToken);
    return data.csrfToken;
  };

  const refreshAccessToken = async (): Promise<void> => {
    console.log('[AuthProvider] refreshAccessToken() called');
    try {
      const csrfToken = await getCsrfToken();
      const res = await api.post('/auth/refresh', {}, { headers: { 'X-CSRF-Token': csrfToken } });
      const { accessToken } = res.data;
      setAccessToken(accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      console.log('[AuthProvider] refreshAccessToken() success: accessToken set');
    } catch (err) {
      console.warn('[AuthProvider] refreshAccessToken() failed:', err);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    console.log('[AuthProvider] login() called');
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
    console.log('[AuthProvider] login() finished');
  };

  const logout = async (): Promise<void> => {
    console.log('[AuthProvider] logout() called');
    const csrfToken = await getCsrfToken();
    await api.post('/auth/logout', {}, { headers: { 'X-CSRF-Token': csrfToken } });
    localStorage.removeItem('access_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    console.log('[AuthProvider] logout() finished');
  };

  useEffect(() => {
    let cancelled = false;
    console.log('[AuthProvider] useEffect init called');

    const releaseLoading = () => {
      if (!loadingReleased.current) {
        setLoading(false);
        loadingReleased.current = true;
        console.log('[AuthProvider] LOADING RELEASED (via releaseLoading)');
      }
    };

    const init = async () => {
      setLoading(true);
      loadingReleased.current = false;
      console.log('[AuthProvider] init: loading set to true');
      try {
        if (getAccessToken()) {
          console.log('[AuthProvider] init: accessToken found in storage');
          await refetchUser();
        } else {
          console.log('[AuthProvider] init: NO accessToken, trying refresh...');
          await refreshAccessToken();
          await refetchUser();
        }
      } catch (err) {
        setUser(null);
        console.warn('[AuthProvider] init: error during auth flow:', err);
      } finally {
        if (!cancelled) releaseLoading();
        else console.log('[AuthProvider] Effect cancelled before loading release');
      }
      // Fallback absoluto: se loading não for libertado, faz após 2s
      setTimeout(() => {
        if (!loadingReleased.current) {
          console.log('[AuthProvider] setTimeout fallback: LOADING RELEASED after 2s!');
          releaseLoading();
        }
      }, 2000);
    };

    init();

    return () => {
      cancelled = true;
      console.log('[AuthProvider] useEffect cleanup (cancelled = true)');
    };
  }, []);

  // Fallback global (garantia absoluta em casos extremos)
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => {
      if (loading) {
        setLoading(false);
        console.log('[AuthProvider] GLOBAL FALLBACK: Loading forced to false!');
      }
    }, 3000); // Garantia adicional, 3 segundos de timeout global
    return () => clearTimeout(t);
  }, [loading]);

  // LOG GLOBAL PARA VER ESTADO EM CADA RENDER
  console.log('[AuthProvider] render:', { loading, user });

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        login,
        logout,
        refetchUser,
        getAccessTokenSecurely: refreshAccessToken,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
