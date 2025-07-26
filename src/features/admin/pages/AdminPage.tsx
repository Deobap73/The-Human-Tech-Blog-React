// src/features/admin/pages/AdminPage.tsx

import { Helmet } from 'react-helmet-async';

import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useAuth } from '../../../shared/hooks/useAuth';
import '../styles/AdminPage.scss';
import ScrollToTop from '../../../shared/components/ScrollToTop';

const AdminPage = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return <div className='admin-unauthorized'>Unauthorized Access</div>;
  }

  return (
    <>
      <Helmet>
        <meta name='robots' content='noindex, nofollow' />
      </Helmet>

      <ScrollToTop />
      <div className='admin-layout'>
        <Sidebar />
        <div className='admin-content'>
          <Topbar />
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
