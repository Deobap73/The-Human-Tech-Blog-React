//The-Human-Tech-Blog-React/src/components/admin/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import './Sidebar.scss';

const Sidebar = () => {
  return (
    <aside className='admin-sidebar'>
      <NavLink to='/admin'>Dashboard</NavLink>
      <NavLink to='/admin/posts'>Posts</NavLink>
      <NavLink to='/admin/categories'>Categories</NavLink>
      <NavLink to='/admin/users'>Users</NavLink>
      <NavLink to='/'>← Back to Site</NavLink>
    </aside>
  );
};

export default Sidebar;
