// The-Human-Tech-Blog-React/src/routes/adminRoute.tsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to='/' replace />;

  return <>{children}</>;
};

export default AdminRoute;
