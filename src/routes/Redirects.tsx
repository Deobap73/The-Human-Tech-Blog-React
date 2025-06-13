// src/routes/Redirects.tsx

import { Navigate } from 'react-router-dom';

export const RedirectToBrowserLang = ({ path = '' }: { path?: string }) => {
  const browserLang = (navigator.language || 'en').split('-')[0];
  const supported = ['en', 'pt', 'de', 'es'];
  const lang = supported.includes(browserLang) ? browserLang : 'en';
  return <Navigate to={`/${lang}${path ? '/' + path : ''}`} replace />;
};

export const NavigateToDefaultLang = () => {
  // Redireciona para /:lang (ex: /en)
  return <Navigate to='/en' replace />;
};
