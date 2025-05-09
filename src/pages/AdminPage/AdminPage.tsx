// The-Human-Tech-Blog-React/src/pages/AdminPage/AdminPage.tsx

import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import Topbar from '../../components/admin/Topbar';
import './AdminPage.scss';

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
