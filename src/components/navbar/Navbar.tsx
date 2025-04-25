// The-Human-Tech-Blog-React/src/components/navbar/Navbar.tsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.scss';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className='navbar'>
      <Link to='/' className='logo'>
        The Human Tech Blog
      </Link>

      <div className='nav-links'>
        {user ? (
          <>
            <span>Welcome, {user.name}</span>
            {user.role === 'admin' && <Link to='/admin'>Admin</Link>}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to='/login'>Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
