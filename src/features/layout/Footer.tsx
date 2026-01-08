// \src\features\layout\Footer.tsx

import './styles/Footer.scss';
import logo from '../../assets/theHumanTechBlogLogo.webp';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';

const socialLinks = [
  {
    label: 'GitHub',
    url: 'https://github.com/Deobap73',
    icon: (
      <svg width='22' height='22' viewBox='0 0 24 24' fill='none'>
        <path
          fill='currentColor'
          d='M12 2C6.48 2 2 6.58 2 12.26c0 4.48 2.87 8.28 6.84 9.63.5.1.68-.22.68-.48v-1.69c-2.78.62-3.37-1.21-3.37-1.21-.45-1.17-1.1-1.49-1.1-1.49-.91-.65.07-.64.07-.64 1 .07 1.53 1.05 1.53 1.05 .89 1.57 2.34 1.12 2.91 .85.09-.66.34-1.12.61-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.11-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05a9.07 9.07 0 0 1 2.5-.34c.85.01 1.71.11 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.21 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.35.3.65.9.65 1.82v2.69c0 .26.18.58.69.48C19.13 20.54 22 16.74 22 12.26 22 6.58 17.52 2 12 2Z'
        />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/deolindobaptista/',
    icon: (
      <svg width='22' height='22' viewBox='0 0 24 24' fill='none'>
        <path
          fill='currentColor'
          d='M19 0h-14c-2.761 0-5 2.238-5 5v14c0 2.762 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.762-2.238-5-5-5zm-11.75 20.25h-3v-10.5h3v10.5zm-1.5-12.062c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.25 12.062h-3v-5.812c0-1.383-.027-3.164-1.928-3.164-1.93 0-2.228 1.507-2.228 3.062v5.914h-3v-10.5h2.881v1.433h.041c.401-.758 1.381-1.557 2.844-1.557 3.043 0 3.605 2.004 3.605 4.608v6.016z'
        />
      </svg>
    ),
  },
  {
    label: 'Portfolio',
    url: 'https://www.deolindobaptista.com',
    icon: (
      <svg width='22' height='22' viewBox='0 0 24 24' fill='none'>
        <path
          fill='currentColor'
          d='M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8 0-1.657.672-3.156 1.757-4.243A7.963 7.963 0 0 0 12 4c1.727 0 3.318.552 4.6 1.49A7.963 7.963 0 0 0 20 12c0 4.418-3.582 8-8 8z'
        />
      </svg>
    ),
  },
];

export const Footer = () => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();

  // Use current language from params or i18n fallback
  const currentLang = lang || i18n.language.split('-')[0] || 'en';

  return (
    <footer className='footer' role='contentinfo' data-analytics-location='footer'>
      <div className='footer__container'>
        <div className='footer__top'>
          <div className='footer__branding'>
            <img src={logo} alt='The Human Tech Blog' className='footer__logo' />
            <span className='footer__brand-text'>The Human Tech Blog</span>
          </div>
          <div className='footer__links'>
            <nav className='footer__nav' aria-label={t('footer.navigation', 'Footer navigation')}>
              <ul className='footer__nav-list'>
                <li>
                  <Link
                    to={`/${currentLang}`}
                    data-analytics-event='footer_link_click'
                    data-analytics-link-text='Home'
                    data-analytics-link-location='footer_nav'>
                    {t('footer.home', 'Home')}
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/${currentLang}/about`}
                    data-analytics-event='footer_link_click'
                    data-analytics-link-text='About'
                    data-analytics-link-location='footer_nav'>
                    {t('footer.about', 'About')}
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/${currentLang}/shorts`}
                    data-analytics-event='footer_link_click'
                    data-analytics-link-text='Tech Shorts'
                    data-analytics-link-location='footer_nav'>
                    {t('footer.shorts', 'Tech Shorts')}
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/${currentLang}/contact`}
                    data-analytics-event='footer_link_click'
                    data-analytics-link-text='Contact'
                    data-analytics-link-location='footer_nav'>
                    {t('footer.contact', 'Contact')}
                  </Link>
                </li>
              </ul>
            </nav>

            <div className='footer__social'>
              {socialLinks.map(({ label, url, icon }) => (
                <a
                  key={label}
                  href={url}
                  className='footer__social-link'
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={label}
                  title={label}
                  data-analytics-event='footer_link_click'
                  data-analytics-link-text={label}
                  data-analytics-link-location='footer_social'
                  data-analytics-link-url={url}>
                  {icon}
                  <span className='footer__sr-only'>{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className='footer__bottom'>
          <div className='footer__desc'>
            {t(
              'footer.description',
              'Exploring the human side of technology through stories, reflections, and insights from the tech world.'
            )}
          </div>
          <div className='footer__copyright'>
            © {new Date().getFullYear()} The Human Tech Blog.{' '}
            {t('footer.rights', 'All rights reserved.')}&nbsp;
            <a
              href='https://www.deolindobaptista.com'
              className='footer__author'
              target='_blank'
              rel='noopener noreferrer'
              data-analytics-event='footer_link_click'
              data-analytics-link-text='Developer'
              data-analytics-link-location='footer_author'
              data-analytics-link-url='https://www.deolindobaptista.com'>
              {t('footer.by', 'by Deolindo Baptista')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
