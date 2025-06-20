// The-Human-Tech-Blog-React/src/features/layout/Layout.tsx

import './styles/Layout.scss';
import { Outlet, useLocation } from 'react-router-dom'; // Import useLocation
import Navbar from './Navbar';
import { Footer } from './Footer';
import { useAuth } from '../../shared/hooks/useAuth';
import { ReactNode } from 'react';
import { getNavbarConfig } from './navbarConfig'; // Import getNavbarConfig

/**
 * Layout component that wraps the main content, navigation bar, and footer.
 * Handles global loading state and applies consistent theming and spacing.
 */
type Props = {
  children?: ReactNode;
};

const Layout = ({ children }: Props) => {
  const { loading } = useAuth();
  const location = useLocation(); // Get the current location
  const navbarConfig = getNavbarConfig(location.pathname); // Get the config for the current path

  // Display a consistent global loader while authentication state is loading
  if (loading) return <div className='route-loader'>Loading...</div>;

  return (
    <div className='layout'>
      {!navbarConfig.hideNavbar && <Navbar />} {/* Conditionally render Navbar */}
      <main className='layout__main' role='main'>
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
