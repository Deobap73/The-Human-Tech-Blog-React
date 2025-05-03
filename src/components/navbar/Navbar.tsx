// The-Human-Tech-Blog-React/src/components/navbar/Navbar.tsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import frontPageImage from '../../assets/frontPage.webp';
import ThemeToggle from '../themeToggle/ThemeToggle';
import { IoPersonSharp } from 'react-icons/io5';
import './Navbar.scss';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/about');
  };

  // Adicione classes condicionais baseadas no tema
  const navbarClasses = `header-home-page ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`;

  return (
    <>
      <header className={navbarClasses}>
        <img
          src={frontPageImage}
          alt='Imagem de fundo do cabeçalho'
          className='header-home-page__background-image'
        />
        <nav className='header-home-page__navbar'>
          <div className='header-home-page__navbar__container'>
            <div className='header-home-page__navbar__container__logo'>
              <img
                src='/src/assets/logo.webp'
                alt='The Human Tech Blog'
                className='header-home-page__navbar__container__logo__image'
              />
            </div>
          </div>
          <div className='header-home-page__navbar__actions'>
            <Link to='/' className='header-home-page__navbar__item'>
              Home
            </Link>
            <Link to='/contact' className='header-home-page__navbar__item'>
              Contact
            </Link>

            {user ? (
              <div className='header-home-page__navbar__actions__user-section'>
                <>
                  {user.role === 'admin' && (
                    <Link
                      to='/admin'
                      className='header-home-page__navbar__actions__user-section__admin-link'>
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className='header-home-page__navbar__actions__user-section__logout-button'>
                    Logout
                  </button>
                </>
              </div>
            ) : (
              <Link to='/login' className='header-home-page__navbar__actions__login-link'>
                <IoPersonSharp />
              </Link>
            )}
            <ThemeToggle />
          </div>
        </nav>
        <div className='header-home-page__tile'>
          <h1 className='header-home-page__tile__logo-title'>The Human Tech Blog</h1>
          <p className='header-home-page__tile__logo-text'>
            Explore the world of project management, frontend, UI/UX and Scrum through my eyes.
            Personal reflections and insights on life and technology
          </p>
        </div>
      </header>
    </>
  );
};

export default Navbar;
