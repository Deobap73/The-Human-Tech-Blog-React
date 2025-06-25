// src/shared/context/AuthProvider.tsx

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
      // The refresh token is httpOnly and will be cleared by the server on /refresh 401.
    }
  };

  /**
   * Login function using API. Sets access token and fetches user.
   */
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
   * Guarantees local cleanup to prevent any refresh loop.
   */
  const logout = async (): Promise<void> => {
    try {
      console.log('[AuthProvider] Logout called');
      await authService.logout();
    } catch (error) {
      console.error('[AuthProvider] Logout failed:', error);
      setAccessToken('');
      localStorage.removeItem('access_token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      window.location.href = '/login';
    } finally {
      setAccessToken('');
      localStorage.removeItem('access_token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
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
      // No throw (avoids refresh loop)
    }
  };

  useEffect(() => {
    let cancelled = false;

    /**
     * Releases the loading state if not already released.
     */
    const releaseLoading = () => {
      if (!loadingReleased.current && !cancelled) {
        setLoading(false);
        loadingReleased.current = true;
        console.log('[AuthProvider] Loading state released.');
      }
    };

    /**
     * Auth initialization logic:
     * 1. Try access token: fetch user.
     * 2. If fails, try refresh token and fetch user again.
     * 3. If both fail, set user as null.
     */
    const init = async () => {
      setLoading(true);
      loadingReleased.current = false;
      try {
        const currentAccessToken = getAccessToken();
        if (currentAccessToken) {
          // Try to fetch user with current token
          try {
            const res = await api.get('/auth/me');
            setUser(res.data.user);
            return;
          } catch (err) {
            // Access token invalid, try refresh
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
          // No access token, try refresh token
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

  // Fallback: ensures loading is released even if something stalls
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
