// The-Human-Tech-Blog-React/src/features/admin/components/Sidebar.tsx

import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.scss';
import { useAuth } from '../../../shared/hooks/useAuth';
import api from '../../../shared/utils/axios';

const Sidebar = () => {
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    // Só busca se for admin ou editor
    if (user && (user.role === 'admin' || user.role === 'editor')) {
      api
        .get('/comments/moderation/count')
        .then((res) => setPendingCount(res.data.count || 0))
        .catch(() => setPendingCount(0));
    }
  }, [user]);

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
        {user && (user.role === 'admin' || user.role === 'editor') && (
          <NavLink to='/admin/comments/moderate' className='admin-sidebar-Navbar-link'>
            Moderate Comments
            {pendingCount > 0 && <span className='sidebar-badge'>{pendingCount}</span>}
          </NavLink>
        )}
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
