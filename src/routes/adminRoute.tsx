// /src/routes/adminRoute.tsx

import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth';

interface Props {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: Props) => {
  const { user, loading } = useAuth();
  const { lang } = useParams();

  if (loading) return <div className='route-loader'>Loading...</div>;

  // Redirect unauthenticated to /:lang home (no /login page)
  if (!user) return <Navigate to={`/${lang || 'en'}`} replace />;
  if (user.role !== 'admin') return <Navigate to={`/${lang || 'en'}/not-authorized`} replace />;

  return <>{children}</>;
};

export default AdminRoute;
