// src/routes/adminRoute.tsx
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth';

interface Props {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: Props) => {
  const { user, loading } = useAuth();
  const { lang } = useParams();

  // Mostra loader global enquanto não sabe auth
  if (loading) return <div className='route-loader'>Loading...</div>;

  // Se não está autenticado, redireciona para login (na língua certa)
  if (!user) return <Navigate to={`/${lang || 'en'}/login`} replace />;
  // Se não é admin, mostra página não autorizada
  if (user.role !== 'admin') return <Navigate to={`/${lang || 'en'}/not-authorized`} replace />;

  return <>{children}</>;
};

export default AdminRoute;
