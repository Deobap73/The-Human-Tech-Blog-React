// The-Human-Tech-Blog-React/src/features/admin/components/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.scss';
import { useAuth } from '../../../shared/hooks/useAuth';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className='admin-sidebar'>
      <nav className='admin-sidebar-Navbar'>
        <NavLink to='/admin' className='admin-sidebar-Navbar-link'>
          Dashboard
        </NavLink>
        <NavLink to='/admin/posts' className='admin-sidebar-Navbar-link'>
          Posts
        </NavLink>
        <NavLink to='/admin/messages' className='admin-sidebar-Navbar-link'>
          Messages
        </NavLink>
        {user && user.role === 'admin' && (
          <NavLink to='/admin/settings' className='admin-sidebar-Navbar-link'>
            Settings
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
