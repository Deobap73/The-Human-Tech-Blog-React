// /src/routes/PublicRoutes.tsx

import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../features/layout/Layout';
import HomePage from '../features/home/pages/HomePage';
import AboutPage from '../features/about/pages/AboutPage';
import SinglePostPage from '../features/post/pages/SinglePostPage';
import WritePage from '../features/post/pages/WritePage';
import AdminRoutes from './adminRoutes';
import UserPage from '../features/user/pages/UserPage';
import AdminTagsPage from '../features/admin/pages/AdminTagsPage';
import TagPage from '../features/tag/pages/TagPage';
import CategoryPage from '../features/post/pages/CategoryPage';
import SearchResultsPage from '../features/search/pages/SearchResultsPage';
import { NavigateToDefaultLang, RedirectToBrowserLang } from './Redirects';
import LoginPage from '../features/auth/pages/LoginPage';
import ContactPage from '../features/contact/pages/ContactPage';
import PrivateRoute from './PrivateRoute';
import ChatRoutes from '../features/chat/pages/ChatRoutes';
import NotAuthorizedPage from '../pages/NotAuthorizedPage';
import RegisterPage from '../features/auth/pages/RegisterPage';

/**
 * PublicRoutes: all content is under language prefix (/:lang).
 * Login/register/not-authorized also under /:lang.
 * No more /login or /register at root!
 */

const SupportedLangs = ['en', 'pt', 'de', 'es'];

const PublicRoutes = () => {
  return (
    <Routes>
      {/* Root: Redirect to browser language */}
      <Route path='/' element={<RedirectToBrowserLang />} />

      {/* No /login or /register at root! */}

      {/* Not Authorized, fallback to /:lang/not-authorized */}
      <Route path='/not-authorized' element={<RedirectToBrowserLang path='not-authorized' />} />

      {/* Admin area: redirect /admin to /:lang/admin */}
      <Route path='/admin/*' element={<RedirectToBrowserLang path='admin' />} />

      {/* All app content under /:lang */}
      <Route path='/:lang' element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path='about' element={<AboutPage />} />
        <Route path='contact' element={<ContactPage />} />
        <Route path='write' element={<WritePage />} />
        <Route path='posts/create' element={<WritePage />} />
        <Route path='posts/:slug' element={<SinglePostPage />} />
        <Route path='tags/:slug' element={<TagPage />} />
        <Route path='tags' element={<AdminTagsPage />} />
        <Route path='categories/:slug' element={<CategoryPage />} />
        <Route path='search' element={<SearchResultsPage />} />
        <Route path='user' element={<UserPage />} />
        {/* Admin area */}
        <Route path='admin/*' element={<AdminRoutes />} />
        {/* Auth pages under language */}
        <Route path='login' element={<LoginPage />} />
        <Route path='register' element={<RegisterPage />} />
        <Route path='not-authorized' element={<NotAuthorizedPage />} />
        {/* Private Chat route */}
        <Route
          path='chat/*'
          element={
            <PrivateRoute>
              <ChatRoutes />
            </PrivateRoute>
          }
        />
        {/* Fallback for /:lang/* */}
        <Route path='*' element={<NavigateToDefaultLang />} />
      </Route>

      {/* Fallback for any unknown route outside language prefix */}
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
};

export default PublicRoutes;
