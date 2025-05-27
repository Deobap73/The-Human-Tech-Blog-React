// src/routes/PrivateRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth';

interface Props {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  const { user, loading } = useAuth();

  // Show loader while authenticating
  if (loading) return <div className='route-loader'>Loading...</div>;

  // Redirect to login if not authenticated
  return user ? <>{children}</> : <Navigate to='/login' replace />;
};

export default PrivateRoute;
