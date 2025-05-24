// The-Human-Tech-Blog-React/src/components/navbar/Navbar.tsx

import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../shared/hooks/useAuth';
import { useTheme } from '../../shared/hooks/useTheme';
import frontPageImage from '../../assets/frontPage.webp';
import logo from '../../assets/Logo.webp';
import ThemeToggle from './ThemeToggle';
import { LoginModal } from '../auth/components/LoginModal';
import { IoPersonSharp } from 'react-icons/io5';
import './styles/Navbar.scss';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/about');
  };

  const navbarClasses = `navbar ${theme === 'dark' ? 'navbar--dark' : 'navbar--light'}`;

  return (
    <header className={navbarClasses}>
      <img src={frontPageImage} alt='Header background' className='navbar__background' />
      <nav className='navbar__nav'>
        <div className='navbar__container'>
          <div className='navbar__logo'>
            <img src={logo} alt='The Human Tech Blog' className='navbar__logo-image' />
          </div>
          <div className='navbar__actions'>
            <Link to='/' className='navbar__item'>
              Home
            </Link>
            <Link to='/contact' className='navbar__item'>
              Contact
            </Link>
            {user ? (
              <div className='navbar__user'>
                {/* Link to User Profile (UserPage) */}
                <Link to='/user' className='navbar__user-profile' title='Profile'>
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className='navbar__user-avatar'
                      style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <IoPersonSharp size={28} style={{ verticalAlign: 'middle' }} />
                  )}
                  <span className='navbar__user-name' style={{ marginLeft: 8 }}>
                    {user.name}
                  </span>
                </Link>
                {(user.role === 'admin' || user.role === 'editor') && (
                  <Link to='/write' className='navbar__item'>
                    Write
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to='/admin/' className='navbar__user-admin'>
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className='navbar__user-logout'>
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)} className='navbar__login'>
                <IoPersonSharp />
              </button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </nav>
      <div className='navbar__tile'>
        <h1 className='navbar__title'>The Human Tech Blog</h1>
        <p className='navbar__description'>
          Explore the world of project management, frontend, UI/UX and Scrum through my eyes.
          Personal reflections and insights on life and technology
        </p>
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </header>
  );
};

export default Navbar;
