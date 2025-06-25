// /src/routes/PrivateRoute.tsx

import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth';

interface Props {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  const { user, loading } = useAuth();
  const { lang } = useParams();

  if (loading) return <div className='route-loader'>Loading...</div>;
  // Show modal, not redirect (for now, fallback to /:lang, you may trigger modal from Navbar)
  return user ? <>{children}</> : <Navigate to={`/${lang || 'en'}`} replace />;
};

export default PrivateRoute;
