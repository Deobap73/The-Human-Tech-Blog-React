// src/shared/context/AuthProvider.tsx
import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import api from '../utils/axios';
import { setAccessToken } from '../utils/authTokenStorage';
import { User } from './AuthContextDef';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  const getAccessTokenSecurely = async (): Promise<void> => {
    try {
      const res = await api.post('/auth/token');
      const { accessToken } = res.data;
      if (accessToken) {
        setAccessToken(accessToken);
        // ✅ Garante que axios usa o novo token imediatamente
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      } else {
        console.warn('⚠️ No access token in response');
      }
    } catch (err) {
      console.error('❌ Failed to get secure access token:', err);
      throw err;
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      await api.post('/auth/login', { email, password });
      await getAccessTokenSecurely(); // 🔑 pega o access token e injeta no header
      await refetchUser(); // ✅ agora com token no header
    } catch (err) {
      console.error('❌ Login failed:', err);
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('access_token');
      delete api.defaults.headers.common['Authorization']; // ❌ limpa o header
      setUser(null);
    } catch (err) {
      console.error('❌ Logout failed:', err);
      throw err;
    }
  };

  // 🔁 Auto login ao abrir app
  useEffect(() => {
    const init = async () => {
      try {
        await api.post('/auth/refresh'); // 🔄 tenta refresh
        await getAccessTokenSecurely(); // 🔑 pega accessToken e injeta header
        await refetchUser(); // 👤 carrega user
      } catch (err) {
        console.warn('⚠️ Refresh failed', err);
        setUser(null);
      }
    };

    void init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refetchUser,
        getAccessTokenSecurely,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
