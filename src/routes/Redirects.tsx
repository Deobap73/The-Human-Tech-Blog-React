import { Navigate } from 'react-router-dom';

export const RedirectToBrowserLang = ({ path = '' }: { path?: string }) => {
  const browserLang = (navigator.language || 'en').split('-')[0];
  const supported = ['en', 'pt', 'de', 'es'];
  const lang = supported.includes(browserLang) ? browserLang : 'en';
  const location = window.location.pathname;

  // Só redireciona se não estiver já na rota certa!
  if (location.startsWith(`/${lang}`)) {
    return null;
  }

  return <Navigate to={`/${lang}${path ? '/' + path : ''}`} replace />;
};
