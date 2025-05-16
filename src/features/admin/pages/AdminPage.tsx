// The-Human-Tech-Blog-React/src/pages/AdminPage/AdminPage.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useAuth } from '../../../shared/hooks/useAuth';
import '../styles/AdminPage.scss';

const AdminPage = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return <div className='admin-unauthorized'>Unauthorized Access</div>;
  }

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
