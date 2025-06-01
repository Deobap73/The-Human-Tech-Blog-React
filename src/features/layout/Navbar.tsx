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
import LanguageSelector from '../../shared/components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { NotificationBell } from '../notification/components/NotificationBell';
import './styles/Navbar.scss';

const buildUrl = (path: string, lang: string) => {
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeLang = lang || i18n.language.split('-')[0] || 'en';

  const handleLogout = async () => {
    await logout();
    navigate(buildUrl('about', activeLang));
    setSidebarOpen(false);
  };

  const isActive = (path: string) => {
    const route = buildUrl(path, activeLang);
    return location.pathname === route;
  };

  // Fecha sidebar ao navegar (usado em links)
  const handleNavClick = () => setSidebarOpen(false);

  const navbarClasses = `navbar ${theme === 'dark' ? 'navbar--dark' : 'navbar--light'}`;

  return (
    <header className={navbarClasses}>
      <img
        src={frontPageImage}
        alt={t('navbar.headerBackgroundAlt')}
        className='navbar__background'
        aria-hidden='true'
      />
      <div className='navbar__row'>
        <div className='navbar__topbar'>
          <div className='navbar__logo'>
            <img
              src={logo}
              alt={t('navbar.logoAlt')}
              className='navbar__logo-image'
              draggable={false}
            />
          </div>
          <button
            className={`navbar__burger${sidebarOpen ? ' navbar__burger--open' : ''}`}
            aria-label='Open menu'
            aria-expanded={sidebarOpen}
            aria-controls='navbar__nav'
            onClick={() => setSidebarOpen((v) => !v)}>
            <span />
            <span />
            <span />
          </button>
        </div>
        <nav
          id='navbar__nav'
          className={`navbar__nav${sidebarOpen ? ' navbar__nav--open' : ''}`}
          role='navigation'
          aria-label={t('navbar.ariaMainNav')}>
          <div className='navbar__nav-container'>
            <div className='navbar__actions'>
              <Link
                to={buildUrl('', activeLang)}
                className={`navbar__item${isActive('') ? ' navbar__item--active' : ''}`}
                aria-current={isActive('') ? 'page' : undefined}
                onClick={handleNavClick}>
                {t('navbar.home')}
              </Link>
              <Link
                to={buildUrl('contact', activeLang)}
                className={`navbar__item${isActive('contact') ? ' navbar__item--active' : ''}`}
                aria-current={isActive('contact') ? 'page' : undefined}
                onClick={handleNavClick}>
                {t('navbar.contact')}
              </Link>
              <Link
                to={buildUrl('about', activeLang)}
                className={`navbar__item${isActive('about') ? ' navbar__item--active' : ''}`}
                aria-current={isActive('about') ? 'page' : undefined}
                onClick={handleNavClick}>
                {t('navbar.about')}
              </Link>
              {user && (
                <div className='navbar__user'>
                  {(user.role === 'admin' || user.role === 'editor') && (
                    <Link
                      to={buildUrl('write', activeLang)}
                      className={`navbar__item${isActive('write') ? ' navbar__item--active' : ''}`}
                      aria-current={isActive('write') ? 'page' : undefined}
                      onClick={handleNavClick}>
                      {t('navbar.write')}
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link
                      to={buildUrl('admin', activeLang)}
                      className={`navbar__user-admin${
                        isActive('admin') ? ' navbar__item--active' : ''
                      }`}
                      aria-current={isActive('admin') ? 'page' : undefined}
                      onClick={handleNavClick}>
                      {t('navbar.admin')}
                    </Link>
                  )}
                  <Link
                    to={buildUrl('user', activeLang)}
                    className='navbar__user-profile'
                    title={t('navbar.profile')}
                    aria-current={isActive('user') ? 'page' : undefined}
                    onClick={handleNavClick}>
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className='navbar__user-avatar'
                        draggable={false}
                      />
                    ) : (
                      <IoPersonSharp size={28} style={{ verticalAlign: 'middle' }} />
                    )}
                  </Link>
                  <span className='navbar__user-name'>{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className='navbar__user-logout'
                    aria-label={t('navbar.logout')}>
                    {t('navbar.logout')}
                  </button>
                </div>
              )}
              {!user && (
                <button
                  onClick={() => {
                    setShowLogin(true);
                    setSidebarOpen(false);
                  }}
                  className='navbar__login'
                  aria-label={t('navbar.login')}>
                  <IoPersonSharp />
                  <span>{t('navbar.login')}</span>
                </button>
              )}
            </div>
          </div>
          <div className='navbar__choices'>
            <SearchBar />
            <ThemeToggle />
            <LanguageSelector />
            <NotificationBell />
          </div>
        </nav>
      </div>
      <div className='navbar__tile'>
        <h1 className='navbar__tile-title'>{t('navbar.title')}</h1>
        <p className='navbar__tile-description'>{t('navbar.description')}</p>
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {sidebarOpen && (
        <div className='navbar__overlay' onClick={() => setSidebarOpen(false)} aria-hidden />
      )}
    </header>
  );
};

export default Navbar;
