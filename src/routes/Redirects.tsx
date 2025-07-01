// /src/routes/Redirects.tsx
import { Navigate } from 'react-router-dom';
import i18n from 'i18next';

export const RedirectToBrowserLang = ({ path = '' }: { path?: string }) => {
  const browserLang = (navigator.language || 'en').split('-')[0];
  const supported = ['en', 'pt', 'de', 'es'];
  const lang = supported.includes(browserLang) ? browserLang : 'en';
  const location = window.location.pathname;

  // Sincronizar com i18n
  if (i18n.language !== lang) {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18n_lang', lang);
  }

  if (location.startsWith(`/${lang}`)) {
    return null;
  }

  return <Navigate to={`/${lang}${path ? '/' + path : ''}`} replace />;
};
