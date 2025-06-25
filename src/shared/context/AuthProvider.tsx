// src/shared/context/AuthProvider.tsx

import { useState, useEffect, useRef } from 'react';
import * as authService from '../services/authService';
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
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch (err) {
      console.error('[AuthProvider] Error refetching user:', err);
      setUser(null);
      localStorage.removeItem('access_token');
      // O refresh token é httpOnly e será limpo pelo servidor no 401 da rota /refresh
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    const res = await api.post('/auth/login', { email, password });
    const { accessToken } = res.data;
    setAccessToken(accessToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await refetchUser();
  };

  /**
   * Secure logout function using authService.logout.
   * Always refreshes CSRF token before POST logout.
   * Garante cleanup local SEMPRE, impedindo qualquer loop de refresh.
   */
  const logout = async (): Promise<void> => {
    try {
      console.log('[AuthProvider] Logout chamado');
      await authService.logout();
      // NOTA: O logout já limpa tokens e faz redirect
    } catch (error) {
      console.error('[AuthProvider] Logout failed:', error);
      // Mesmo em erro, limpar tudo local
      setAccessToken('');
      localStorage.removeItem('access_token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      window.location.href = '/login';
    } finally {
      // Redundante, mas previne qualquer race de estado
      setAccessToken('');
      localStorage.removeItem('access_token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  const register = async (payload: authService.RegisterPayload) => {
    return await authService.register(payload);
  };

  const refreshAccessToken = async (): Promise<void> => {
    try {
      const res = await api.post('/auth/refresh');
      const { accessToken } = res.data;
      setAccessToken(accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      console.log('[AuthProvider] Access token successfully refreshed.');
    } catch (err) {
      console.warn(
        '[AuthProvider] Failed to refresh access token, likely no valid refresh token or session expired.'
      );
      localStorage.removeItem('access_token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      // Sem throw (evita loop)
    }
  };

  useEffect(() => {
    let cancelled = false;

    const releaseLoading = () => {
      if (!loadingReleased.current && !cancelled) {
        setLoading(false);
        loadingReleased.current = true;
        console.log('[AuthProvider] Loading state released.');
      }
    };

    const init = async () => {
      setLoading(true);
      loadingReleased.current = false;
      try {
        const currentAccessToken = getAccessToken();
        if (currentAccessToken) {
          await refetchUser();
          if (user) {
            console.log('[AuthProvider] User fetched with existing access token.');
          } else {
            console.log('[AuthProvider] Existing access token invalid, attempting to refresh...');
            await refreshAccessToken();
            if (getAccessToken()) {
              await refetchUser();
            }
          }
        } else {
          console.log('[AuthProvider] No access token found, attempting initial refresh...');
          await refreshAccessToken();
          if (getAccessToken()) {
            await refetchUser();
          }
        }
      } catch (err) {
        console.error('[AuthProvider] Initialization error:', err);
        setUser(null);
        localStorage.removeItem('access_token');
        delete api.defaults.headers.common['Authorization'];
      } finally {
        if (!cancelled) {
          releaseLoading();
        }
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  // Fallback para garantir que o loading é liberado
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => {
      if (loading) {
        setLoading(false);
        loadingReleased.current = true;
        console.warn('[AuthProvider] Forced loading state release after timeout.');
      }
    }, 3000);
    return () => clearTimeout(t);
  }, [loading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        login,
        register,
        logout,
        refetchUser,
        getAccessTokenSecurely: refreshAccessToken,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
