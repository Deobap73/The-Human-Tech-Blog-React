// /src/features/layout/Navbar.tsx

'use strict';

import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../shared/hooks/useAuth';
import { useTheme } from '../../shared/hooks/useTheme';
import logo from '../../assets/Logo.webp';
import ThemeToggle from './ThemeToggle';
import { LoginModal } from '../auth/components/LoginModal';
import { IoPersonSharp } from 'react-icons/io5';
import { IoIosChatbubbles } from 'react-icons/io';
import SearchBar from '../../features/search/components/SearchBar';
import LanguageSelector from '../../shared/components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { NotificationBell } from '../notification/components/NotificationBell';
import { getNavbarConfig } from './navbarConfig';
import './styles/Navbar.scss';

const buildUrl = (path: string, lang: string) => {
  const normalized = typeof path === 'string' && path.startsWith('/') ? path.slice(1) : path;
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

  const activeLang = lang || i18n.language.split('_')[0].split('-')[0] || 'en';

  const config = getNavbarConfig(location.pathname);
  const isCompact = !config.background && !config.showTile;

  const navbarClasses =
    `navbar ${theme === 'dark' ? 'navbar--dark' : 'navbar--light'}` +
    (isCompact ? ' navbar--compact' : '');

  const handleLogout = async () => {
    await logout();
    navigate(buildUrl('home', activeLang));
    setSidebarOpen(false);
  };

  const isActive = (path: string) => {
    const route = buildUrl(path, activeLang);
    return location.pathname === route;
  };

  const handleNavClick = () => setSidebarOpen(false);

  return (
    <header className={navbarClasses} data-analytics-location='navbar'>
      {config.background && !isCompact && (
        <img
          src={config.background}
          alt={t('navbar.backgroundAlt', { defaultValue: 'Navbar background' })}
          className='navbar__background'
          aria-hidden='true'
          loading='lazy'
        />
      )}

      <div className='navbar__row'>
        <div className='navbar__topbar'>
          <div className='navbar__logo'>
            <Link
              to={buildUrl('', activeLang)}
              data-analytics-event='nav_link_click'
              data-analytics-link-text='Logo'
              data-analytics-link-location='navbar_logo'>
              <img
                src={logo}
                alt={t('navbar.logoAlt')}
                className='navbar__logo-image'
                draggable={false}
                loading='lazy'
              />
            </Link>
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
          aria-label={t('navbar.ariaMainNav', { defaultValue: 'Main navigation' })}>
          <div className='navbar__nav-container'>
            <div className='navbar__actions'>
              <Link
                to={buildUrl('', activeLang)}
                className={`navbar__item${isActive('') ? ' navbar__item--active' : ''}`}
                aria-current={isActive('') ? 'page' : undefined}
                onClick={handleNavClick}
                data-analytics-event='nav_link_click'
                data-analytics-link-text='Home'
                data-analytics-link-location='navbar_main'>
                {t('navbar.home')}
              </Link>

              <Link
                to={buildUrl('projects', activeLang)}
                className={`navbar__item${isActive('projects') ? ' navbar__item--active' : ''}`}
                aria-current={isActive('projects') ? 'page' : undefined}
                onClick={handleNavClick}
                data-analytics-event='nav_link_click'
                data-analytics-link-text='Projects'
                data-analytics-link-location='navbar_main'>
                {t('navbar.projects', { defaultValue: 'Projects' })}
              </Link>

              <Link
                to={buildUrl('contact', activeLang)}
                className={`navbar__item${isActive('contact') ? ' navbar__item--active' : ''}`}
                aria-current={isActive('contact') ? 'page' : undefined}
                onClick={handleNavClick}
                data-analytics-event='nav_link_click'
                data-analytics-link-text='Contact'
                data-analytics-link-location='navbar_main'>
                {t('navbar.contact')}
              </Link>

              <Link
                to={buildUrl('about', activeLang)}
                className={`navbar__item${isActive('about') ? ' navbar__item--active' : ''}`}
                aria-current={isActive('about') ? 'page' : undefined}
                onClick={handleNavClick}
                data-analytics-event='nav_link_click'
                data-analytics-link-text='About'
                data-analytics-link-location='navbar_main'>
                {t('navbar.about')}
              </Link>

              {user && (
                <div className='navbar__user'>
                  {(user.role === 'admin' || user.role === 'editor') && (
                    <Link
                      to={buildUrl('write', activeLang)}
                      className={`navbar__item${isActive('write') ? ' navbar__item--active' : ''}`}
                      aria-current={isActive('write') ? 'page' : undefined}
                      onClick={handleNavClick}
                      data-analytics-event='nav_link_click'
                      data-analytics-link-text='Write'
                      data-analytics-link-location='navbar_user'>
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
                      onClick={handleNavClick}
                      data-analytics-event='nav_link_click'
                      data-analytics-link-text='Admin'
                      data-analytics-link-location='navbar_user'>
                      {t('navbar.admin')}
                    </Link>
                  )}

                  <Link
                    to={buildUrl('user', activeLang)}
                    className='navbar__user-profile'
                    title={t('navbar.profile')}
                    aria-current={isActive('user') ? 'page' : undefined}
                    onClick={handleNavClick}
                    data-analytics-event='nav_link_click'
                    data-analytics-link-text='Profile'
                    data-analytics-link-location='navbar_user'>
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className='navbar__user-avatar'
                        draggable={false}
                        loading='lazy'
                      />
                    ) : (
                      <IoPersonSharp size={28} style={{ verticalAlign: 'middle' }} />
                    )}
                  </Link>

                  <Link
                    to={buildUrl('chat', activeLang)}
                    className='navbar__user-chat'
                    title={t('navbar.chat')}
                    aria-label={t('navbar.chat')}
                    onClick={handleNavClick}
                    style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 12 }}
                    data-analytics-event='nav_link_click'
                    data-analytics-link-text='Chat'
                    data-analytics-link-location='navbar_user'>
                    <IoIosChatbubbles size={26} style={{ verticalAlign: 'middle' }} />
                  </Link>

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
                  aria-label={t('navbar.login')}
                  data-analytics-event='nav_link_click'
                  data-analytics-link-text='Login'
                  data-analytics-link-location='navbar_user'>
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

      {config.showTile && !isCompact && (
        <div className='navbar__tile'>
          <h1 className='navbar__tile-title'>{config.tileTitle ? config.tileTitle(t) : ''}</h1>
          <p className='navbar__tile-description'>
            {config.tileDescription ? config.tileDescription(t) : ''}
          </p>
        </div>
      )}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      <div
        className={`navbar__overlay${sidebarOpen ? ' navbar__overlay--open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden
      />
    </header>
  );
};

export default Navbar;
