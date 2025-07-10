// /src/shared/context/AuthProvider.tsx

import { useState, useEffect, useRef } from 'react';
import * as authService from '../services/authService';
import { AuthContext } from './AuthContext';
import api from '../utils/axios';
import { setAccessToken, getAccessToken } from '../utils/authTokenStorage';
import { User } from './AuthContextDef';

/**
 * AuthProvider component manages authentication state and provides auth context to the app.
 * Handles loading state, login, logout, registration, token refresh, and user fetching logic.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const loadingReleased = useRef(false);

  /**
   * Fetches the authenticated user from the API.
   */
  const refetchUser = async (): Promise<void> => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch (err) {
      console.error('[AuthProvider] Error refetching user:', err);
      setUser(null);
      localStorage.removeItem('access_token');
    }
  };

  /**
   * Login function using API. Sets access token and fetches user.
   * Supports optional Google reCAPTCHA v3 token.
   */
  const login = async (email: string, password: string, captcha?: string): Promise<void> => {
    const res = await api.post('/auth/login', { email, password, ...(captcha ? { captcha } : {}) });
    const { accessToken } = res.data;
    setAccessToken(accessToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await refetchUser();
  };

  /**
   * Secure logout function using authService.logout.
   */
  const logout = async (): Promise<void> => {
    try {
      console.log('[AuthProvider] Logout called');
      await authService.logout();
    } catch (error) {
      console.error('[AuthProvider] Logout failed:', error);
    } finally {
      setAccessToken('');
      localStorage.removeItem('access_token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      window.location.href = '/login'; // Always redirect to login for full context reset
    }
  };

  /**
   * Registration function.
   */
  const register = async (payload: authService.RegisterPayload) => {
    return await authService.register(payload);
  };

  /**
   * Refreshes the access token using the refresh token (if present).
   */
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
          try {
            const res = await api.get('/auth/me');
            setUser(res.data.user);
            return;
          } catch (err) {
            console.log('[AuthProvider] Existing access token invalid, attempting to refresh...');
            await refreshAccessToken();
            const refreshedToken = getAccessToken();
            if (refreshedToken) {
              try {
                const res2 = await api.get('/auth/me');
                setUser(res2.data.user);
                return;
              } catch {
                setUser(null);
              }
            } else {
              setUser(null);
            }
          }
        } else {
          console.log('[AuthProvider] No access token found, attempting initial refresh...');
          await refreshAccessToken();
          const refreshedToken = getAccessToken();
          if (refreshedToken) {
            try {
              const res3 = await api.get('/auth/me');
              setUser(res3.data.user);
            } catch {
              setUser(null);
            }
          } else {
            setUser(null);
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
