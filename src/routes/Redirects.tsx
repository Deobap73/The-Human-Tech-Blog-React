// File: src/routes/Redirects.tsx

import { Navigate, useLocation } from 'react-router-dom';
import i18n from 'i18next';

export const RedirectToBrowserLang = () => {
  const { pathname, search } = useLocation();
  const browserLang = (navigator.language || 'en').split('-')[0];
  const supported = ['en', 'pt', 'de', 'es'];
  const lang = supported.includes(browserLang) ? browserLang : 'en';

  // Sync i18n
  if (i18n.language !== lang) {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18n_lang', lang);
  }

  // If already prefixed, do nothing
  if (pathname.startsWith(`/${lang}/`)) {
    return null;
  }

  // Redirect preserving full path and query
  return <Navigate to={`/${lang}${pathname}${search}`} replace />;
};
