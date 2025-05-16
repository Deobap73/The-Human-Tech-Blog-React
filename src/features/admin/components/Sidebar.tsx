// The-Human-Tech-Blog-React/src/features/admin/components/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.scss';
import { useAuth } from '../../../shared/hooks/useAuth';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className='admin-sidebar'>
      <nav>
        <NavLink to='/admin' className='admin-link'>
          Dashboard
        </NavLink>
        <NavLink to='/admin/posts' className='admin-link'>
          Posts
        </NavLink>
        <NavLink to='/admin/messages' className='admin-link'>
          Messages
        </NavLink>
        {user && user.role === 'admin' && (
          <NavLink to='/admin/settings' className='admin-link'>
            Settings
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
