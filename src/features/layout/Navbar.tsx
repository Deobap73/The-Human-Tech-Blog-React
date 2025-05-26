// /src/components/navbar/Navbar.tsx

import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../shared/hooks/useAuth';
import { useTheme } from '../../shared/hooks/useTheme';
import frontPageImage from '../../assets/frontPage.webp';
import logo from '../../assets/Logo.webp';
import ThemeToggle from './ThemeToggle';
import { LoginModal } from '../auth/components/LoginModal';
import { IoPersonSharp } from 'react-icons/io5';
import SearchBar from '../../features/search/components/SearchBar';
import './styles/Navbar.scss';
import LanguageSelector from '../../shared/components/LanguageSelector';
import { useTranslation } from 'react-i18next';

/**
 * Helper to build multilanguage-aware URLs.
 * Ensures all navigation uses current language prefix.
 */
const buildUrl = (path: string, lang: string) => {
  // Remove any leading slash from path
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return `/${lang}/${normalized}`;
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useParams<{ lang: string }>();
  const [showLogin, setShowLogin] = useState(false);

  // Use the active lang from the route or i18n fallback
  const activeLang = lang || i18n.language.split('-')[0] || 'en';

  const handleLogout = async () => {
    await logout();
    // Redirect to about page with language prefix
    navigate(buildUrl('about', activeLang));
  };

  const navbarClasses = `navbar ${theme === 'dark' ? 'navbar--dark' : 'navbar--light'}`;

  return (
    <header className={navbarClasses}>
      <img
        src={frontPageImage}
        alt={t('navbar.headerBackgroundAlt')}
        className='navbar__background'
      />
      <nav className='navbar__nav'>
        <div className='navbar__container'>
          <div className='navbar__logo'>
            <img src={logo} alt={t('navbar.logoAlt')} className='navbar__logo-image' />
          </div>
          <div className='navbar__actions'>
            {/* Home Link */}
            <Link to={buildUrl('', activeLang)} className='navbar__item'>
              {t('navbar.home')}
            </Link>
            {/* Contact Link */}
            <Link to={buildUrl('contact', activeLang)} className='navbar__item'>
              {t('navbar.contact')}
            </Link>
            {user ? (
              <div className='navbar__user'>
                {/* User Profile Link */}
                <Link
                  to={buildUrl('user', activeLang)}
                  className='navbar__user-profile'
                  title={t('navbar.profile')}>
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
                  <Link to={buildUrl('write', activeLang)} className='navbar__item'>
                    {t('navbar.write')}
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to={buildUrl('admin', activeLang)} className='navbar__user-admin'>
                    {t('navbar.admin')}
                  </Link>
                )}
                <button onClick={handleLogout} className='navbar__user-logout'>
                  {t('navbar.logout')}
                </button>
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)} className='navbar__login'>
                <IoPersonSharp />
                <span style={{ marginLeft: 4 }}>{t('navbar.login')}</span>
              </button>
            )}
            <SearchBar />
            <ThemeToggle />
            <LanguageSelector />
          </div>
        </div>
      </nav>
      <div className='navbar__tile'>
        <h1 className='navbar__title'>{t('navbar.title')}</h1>
        <p className='navbar__description'>{t('navbar.description')}</p>
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </header>
  );
};

export default Navbar;
