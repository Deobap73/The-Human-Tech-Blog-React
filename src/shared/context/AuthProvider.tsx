// The-Human-Tech-Blog-React/src/shared/context/AuthProvider.tsx

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
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch (err) {
      console.error('[AuthProvider] Error refetching user:', err);
      setUser(null); // Garante que o usuário é limpo se o token 'me' falhar
      localStorage.removeItem('access_token'); // Limpa access token inválido
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

  const logout = async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('[AuthProvider] Logout failed:', error);
      // Mesmo se o logout no servidor falhar (ex: token já inválido),
      // devemos limpar o estado do cliente.
    } finally {
      localStorage.removeItem('access_token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
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
      // IMPORTANTE: Se o refresh falhar, significa que o usuário não está logado.
      // Limpe qualquer token de acesso local e defina o usuário como null.
      localStorage.removeItem('access_token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      // NENHUM throw, pois a falha de refresh inicial é um comportamento esperado para usuários não logados.
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
          // Tentar refetch do usuário com o token existente
          await refetchUser();
          if (user) {
            // Se refetchUser for bem-sucedido, estamos logados
            console.log('[AuthProvider] User fetched with existing access token.');
          } else {
            // Se o token existente for inválido, tentar refresh
            console.log('[AuthProvider] Existing access token invalid, attempting to refresh...');
            await refreshAccessToken();
            if (getAccessToken()) {
              // Se o refresh for bem-sucedido, tente refetch user novamente
              await refetchUser();
            }
          }
        } else {
          // Não há access token, tentar refresh (para pegar de um refresh token em cookie)
          console.log('[AuthProvider] No access token found, attempting initial refresh...');
          await refreshAccessToken();
          if (getAccessToken()) {
            // Se o refresh for bem-sucedido, tente refetch user
            await refetchUser();
          }
        }
      } catch (err) {
        console.error('[AuthProvider] Initialization error:', err);
        // Qualquer erro durante a inicialização deve resultar em usuário não autenticado
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
  }, []); // Dependências vazias para rodar apenas na montagem

  // Fallback para garantir que o loading é liberado
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => {
      if (loading) {
        setLoading(false);
        loadingReleased.current = true;
        console.warn('[AuthProvider] Forced loading state release after timeout.');
      }
    }, 3000); // Libera o loading após 3 segundos no máximo
    return () => clearTimeout(t);
  }, [loading]); // Observa o estado de loading

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
