import { useEffect } from 'react';
import { useAuth } from './shared/hooks/useAuth';
import { setAccessToken } from './shared/utils/authTokenStorage';
import { ensureCsrfToken } from './shared/utils/csrf';
import { Routes, Route } from 'react-router-dom';
import PublicRoutes from './routes/PublicRoutes';
import NotAuthorizedPage from './pages/NotAuthorizedPage';
import { useTranslation } from 'react-i18next';
import NewsletterModal from './features/notification/newsletter/components/NewsletterModal';

// ✅ adiciona isto
import { useAnalytics } from './hooks/useAnalytics';

function App() {
  const { user, loading } = useAuth();
  const { i18n } = useTranslation();

  // ✅ ativa o hook de GA (tem de estar dentro de um Router; no Vite, o BrowserRouter costuma estar em main.tsx)
  useAnalytics();

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

  useEffect(() => {
    ensureCsrfToken();
  }, []);

  useEffect(() => {
    const storedLang = localStorage.getItem('i18n_lang');
    const browserLang = navigator.language.split('-')[0];
    const supported = ['en', 'pt', 'de', 'es'];

    if (!storedLang && supported.includes(browserLang)) {
      i18n.changeLanguage(browserLang);
      localStorage.setItem('i18n_lang', browserLang);
    }
  }, [i18n]);

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
