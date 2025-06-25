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
 * PublicRoutes handles all the public and private routes of the application.
 * Ensures Home and public pages are never blocked by auth.
 * Private routes (like chat) are protected and will redirect to login if unauthenticated.
 * Order of routes is IMPORTANT! More specific routes must come before catch-alls.
 */

const SupportedLangs = ['en', 'pt', 'de', 'es'];

const PublicRoutes = () => {
  return (
    <Routes>
      {/* 1. Root path: Redirect to browser's preferred language (e.g., / -> /en) */}
      <Route path='/' element={<RedirectToBrowserLang />} />

      {/* 2. Login and Register - must always be public, never with /:lang prefix */}
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />

      {/* 3. Not Authorized page */}
      <Route path='/not-authorized' element={<NotAuthorizedPage />} />

      {/* 4. Admin area: redirect /admin to language-specific route */}
      <Route path='/admin/*' element={<RedirectToBrowserLang path='admin' />} />

      {/* 5. All main content under language prefix with shared layout */}
      <Route path='/:lang' element={<Layout />}>
        {/* HomePage - index route */}
        <Route index element={<HomePage />} />

        {/* Public content pages */}
        <Route path='about' element={<AboutPage />} />
        <Route path='contact' element={<ContactPage />} />

        {/* Blog posts, tags, categories */}
        <Route path='write' element={<WritePage />} />
        <Route path='posts/create' element={<WritePage />} />
        <Route path='posts/:slug' element={<SinglePostPage />} />
        <Route path='tags/:slug' element={<TagPage />} />
        <Route path='tags' element={<AdminTagsPage />} />
        <Route path='categories/:slug' element={<CategoryPage />} />
        <Route path='search' element={<SearchResultsPage />} />
        <Route path='user' element={<UserPage />} />

        {/* Admin area under language */}
        <Route path='admin/*' element={<AdminRoutes />} />

        {/* Private Chat route (protected by PrivateRoute) */}
        <Route
          path='chat/*'
          element={
            <PrivateRoute>
              <ChatRoutes />
            </PrivateRoute>
          }
        />

        {/* Fallback for any unknown route under /:lang */}
        <Route path='*' element={<NavigateToDefaultLang />} />
      </Route>

      {/* 6. Fallback for any unknown route outside language prefix */}
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
};

export default PublicRoutes;
