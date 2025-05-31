// src/App.tsx

import { useAuth } from './shared/hooks/useAuth';
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
