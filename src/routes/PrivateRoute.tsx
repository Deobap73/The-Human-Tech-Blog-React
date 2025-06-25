// /src/routes/PrivateRoute.tsx

import { useAuth } from '../shared/hooks/useAuth';
import { useLoginModal } from '../shared/hooks/useLoginModal';

interface Props {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  const { user, loading } = useAuth();
  const { open } = useLoginModal();

  // If still loading user info, show loader
  if (loading) return <div className='route-loader'>Loading...</div>;

  // If not authenticated, open the login modal and block route access
  if (!user) {
    open();
    return null; // Do not render children or redirect
  }

  // Authenticated: render protected content
  return <>{children}</>;
};

export default PrivateRoute;
