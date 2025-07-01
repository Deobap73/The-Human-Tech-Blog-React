// /src/features/layout/Layout.tsx

import './styles/Layout.scss';
import { Outlet, useLocation, useParams, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import { Footer } from './Footer';
import { useAuth } from '../../shared/hooks/useAuth';
import { useEffect } from 'react';
import { getNavbarConfig } from './navbarConfig';
import { LoginModal } from '../auth/components/LoginModal';
import { RegisterModal } from '../auth/components/RegisterModal';
import { useLoginModal } from '../../shared/hooks/useLoginModal';
import { useTranslation } from 'react-i18next';

const supportedLangs = ['en', 'pt', 'de', 'es'];

const Layout = () => {
  const { loading } = useAuth();
  const location = useLocation();
  const navbarConfig = getNavbarConfig(location.pathname);
  const { lang } = useParams();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (lang && supportedLangs.includes(lang) && i18n.language !== lang) {
      i18n.changeLanguage(lang);
      localStorage.setItem('i18n_lang', lang);
    }
  }, [lang, i18n]);

  if (lang && !supportedLangs.includes(lang)) {
    return <Navigate to={`/en`} replace />;
  }

  const { isOpen, close, registerOpen, closeRegister, open } = useLoginModal();

  useEffect(() => {
    const onLogout = () => {
      open();
    };
    window.addEventListener('auth:logout', onLogout);
    return () => window.removeEventListener('auth:logout', onLogout);
  }, [open]);

  if (loading) return <div className='route-loader'>Loading...</div>;

  return (
    <div className='layout'>
      {!navbarConfig.hideNavbar && <Navbar />}
      <main className='layout__main' role='main'>
        <Outlet />
      </main>
      <Footer />
      {isOpen && !registerOpen && <LoginModal onClose={close} />}
      {isOpen && registerOpen && <RegisterModal onClose={closeRegister} />}
    </div>
  );
};

export default Layout;
