// src/routes/PrivateRoute.tsx
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth';

interface Props {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  const { user, loading } = useAuth();
  const { lang } = useParams();

  // Show loader while authenticating
  if (loading) return <div className='route-loader'>Loading...</div>;

  // Redirect to login in correct language
  return user ? <>{children}</> : <Navigate to={`/${lang || 'en'}/login`} replace />;
};

export default PrivateRoute;
