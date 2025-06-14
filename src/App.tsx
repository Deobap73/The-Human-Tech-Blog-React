// /src/App.tsx

import { ensureCsrfToken } from './shared/utils/csrf';
import { useEffect } from 'react';
import { useAuth } from './shared/hooks/useAuth';
import { setAccessToken } from './shared/utils/authTokenStorage';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import PublicRoutes from './routes/PublicRoutes';
import NotAuthorizedPage from './pages/NotAuthorizedPage';

/**
 * App entry point: Handles global loading state and main routes.
 * Note: Home and public pages are always accessible (not blocked by auth).
 */
function App() {
  const { user, loading } = useAuth();

  // OAuth2 patch: On first load, check for ?token=... in the URL (after OAuth login)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setAccessToken(token);
      // Remove token from URL for security/cleanliness
      params.delete('token');
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname + (params.toString() ? `?${params}` : '')
      );
      // Force reload so AuthProvider will initialize with the new token
      window.location.reload();
    }
  }, []);

  // Guarantee CSRF token on app start
  useEffect(() => {
    ensureCsrfToken();
  }, []);

  if (loading) return <div className='route-loader'>Loading...</div>;

  // Public routes are always available, home is never blocked for unauthenticated users!
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/not-authorized' element={<NotAuthorizedPage />} />
      <Route path='/*' element={<PublicRoutes />} />
    </Routes>
  );
}

export default App;
