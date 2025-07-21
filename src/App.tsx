// /src/App.tsx

import { useEffect } from 'react';
import { useAuth } from './shared/hooks/useAuth';
import { setAccessToken } from './shared/utils/authTokenStorage';
import { ensureCsrfToken } from './shared/utils/csrf';
import { Routes, Route } from 'react-router-dom';
import PublicRoutes from './routes/PublicRoutes';
import NotAuthorizedPage from './pages/NotAuthorizedPage';
import { useTranslation } from 'react-i18next';
import NewsletterModal from './features/notification/newsletter/components/NewsletterModal';

/**
 * App entry point: Handles global loading state and main routes.
 * Note: Home and public pages are always accessible (not blocked by auth).
 */
function App() {
  const { user, loading } = useAuth();
  const { i18n } = useTranslation();

  // OAuth2 patch: On first load, check for ?token=... in the URL (after OAuth login)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setAccessToken(token);
      params.delete('token');
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname + (params.toString() ? `?${params}` : '')
      );
      window.location.reload();
    }
  }, []);

  // Guarantee CSRF token on app start
  useEffect(() => {
    ensureCsrfToken();
  }, []);

  // Language detection fallback on first visit
  useEffect(() => {
    const storedLang = localStorage.getItem('i18n_lang');
    const browserLang = navigator.language.split('-')[0]; // ex: 'pt', 'de', etc.
    const supported = ['en', 'pt', 'de', 'es'];

    if (!storedLang && supported.includes(browserLang)) {
      i18n.changeLanguage(browserLang);
      localStorage.setItem('i18n_lang', browserLang);
    }
  }, [i18n]);

  // open NewsletterModal
  if (loading) return <div className='route-loader'>Loading...</div>;

  return (
    <>
      <NewsletterModal />
      <Routes>
        <Route path='/not-authorized' element={<NotAuthorizedPage />} />
        <Route path='/*' element={<PublicRoutes />} />
      </Routes>
    </>
  );
}

export default App;
