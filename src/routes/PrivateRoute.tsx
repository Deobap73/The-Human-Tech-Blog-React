// The-Human-Tech-Blog-React/src/routes/PrivateRoute.tsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/services/useAuth';

interface Props {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? children : <Navigate to='/login' replace />;
};

export default PrivateRoute;
