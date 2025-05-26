// src/routes/Redirects.tsx
import { Navigate, useLocation } from 'react-router-dom';

export const RedirectToBrowserLang = () => {
  const browserLang = (navigator.language || 'en').split('-')[0];
  const supported = ['en', 'pt', 'de', 'es'];
  const lang = supported.includes(browserLang) ? browserLang : 'en';
  return <Navigate to={`/${lang}`} replace />;
};

export const NavigateToDefaultLang = () => {
  // Redireciona para /:lang (ex: /en)
  return <Navigate to='/en' replace />;
};
