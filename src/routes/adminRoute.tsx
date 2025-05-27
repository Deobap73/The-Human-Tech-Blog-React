// src/routes/adminRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth';

interface Props {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: Props) => {
  const { user, loading } = useAuth();

  // Show loader while authenticating
  if (loading) return <div className='route-loader'>Loading...</div>;

  // Redirect if not authenticated or not admin
  if (!user) return <Navigate to='/login' replace />;
  if (user.role !== 'admin') return <Navigate to='/not-authorized' replace />;

  return <>{children}</>;
};

export default AdminRoute;
