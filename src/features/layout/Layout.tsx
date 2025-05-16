// The-Human-Tech-Blog-React/src/components/layout/Layout.tsx
import './styles/Layout.scss';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Footer } from './Footer';
import { useAuth } from '../../shared/hooks/useAuth';

const Layout = () => {
  const { loading } = useAuth();

  if (loading) return <div className='layout__loading'>Loading...</div>;

  return (
    <div className='layout'>
      <Navbar />
      <main className='layout__main'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
