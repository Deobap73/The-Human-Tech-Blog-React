// The-Human-Tech-Blog-React/src/features/admin/pages/AdminPage.tsx

import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import '../styles/AdminPage.scss';

const AdminPage = () => {
  return (
    <div className='admin-layout'>
      <Sidebar />
      <div className='admin-content'>
        <Topbar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
