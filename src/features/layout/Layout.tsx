// The-Human-Tech-Blog-React/src/features/layout/Layout.tsx
import './styles/Layout.scss';
import { Outlet } from 'react-router-dom';
import { NotificationBell } from '../notification/components/NotificationBell';
import Navbar from './Navbar';
import { Footer } from './Footer';
import { useAuth } from '../../shared/hooks/useAuth';
import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

const Layout = ({ children }: Props) => {
  const { loading } = useAuth();

  if (loading) return <div className='layout__loading'>Loading...</div>;

  return (
    <div className='layout'>
      <NotificationBell />
      <Navbar />
      <main className='layout__main'>{children || <Outlet />}</main>
      <Footer />
    </div>
  );
};

export default Layout;
