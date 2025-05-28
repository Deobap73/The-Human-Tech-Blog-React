// src/App.tsx
import { useAuth } from './shared/hooks/useAuth';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import PublicRoutes from './routes/PublicRoutes';
import NotAuthorizedPage from './pages/NotAuthorizedPage';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className='route-loader'>Loading...</div>;
  // NÃO bloqueia home para users não autenticados!
  console.log(loading, user);
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
