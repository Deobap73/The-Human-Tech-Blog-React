// /src/features/layout/Layout.tsx

import './styles/Layout.scss';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { Footer } from './Footer';
import { useAuth } from '../../shared/hooks/useAuth';
import { ReactNode } from 'react';
import { getNavbarConfig } from './navbarConfig';

// --- Import login modal and context hook
import { LoginModal } from '../auth/components/LoginModal';
import { RegisterModal } from '../auth/components/RegisterModal';
import { useLoginModal } from '../../shared/hooks/useLoginModal';

/**
 * Layout component that wraps the main content, navigation bar, and footer.
 * Handles global loading state and applies consistent theming and spacing.
 */
type Props = {
  children?: ReactNode;
};

const Layout = ({ children }: Props) => {
  const { loading } = useAuth();
  const location = useLocation();
  const navbarConfig = getNavbarConfig(location.pathname);

  // --- Contexto do modal
  const { isOpen, close, registerOpen, closeRegister } = useLoginModal();

  if (loading) return <div className='route-loader'>Loading...</div>;

  return (
    <div className='layout'>
      {!navbarConfig.hideNavbar && <Navbar />}
      <main className='layout__main' role='main'>
        {children || <Outlet />}
      </main>
      <Footer />
      {/* Login/Register Modal Global */}
      {isOpen && !registerOpen && <LoginModal onClose={close} />}
      {isOpen && registerOpen && <RegisterModal onClose={closeRegister} />}
    </div>
  );
};

export default Layout;
