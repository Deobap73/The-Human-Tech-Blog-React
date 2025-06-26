// /src/routes/PublicRoutes.tsx

import { Routes, Route } from 'react-router-dom';
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
import { RedirectToBrowserLang } from './Redirects';
import ContactPage from '../features/contact/pages/ContactPage';
import PrivateRoute from './PrivateRoute';
import ChatRoutes from '../features/chat/pages/ChatRoutes';
import NotAuthorizedPage from '../pages/NotAuthorizedPage';

// --- ADD: Simple NotFoundPage component ---
const NotFoundPage = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>404 - Page Not Found</h1>
  </div>
);

const SupportedLangs = ['en', 'pt', 'de', 'es'];

const PublicRoutes = () => {
  return (
    <Routes>
      {/* Root: Redirect to browser language */}
      <Route path='/' element={<RedirectToBrowserLang />} />
      <Route path='/not-authorized' element={<RedirectToBrowserLang path='not-authorized' />} />
      <Route path='/admin/*' element={<RedirectToBrowserLang path='admin' />} />
      <Route path='/:lang' element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path='about' element={<AboutPage />} />
        <Route path='contact' element={<ContactPage />} />
        <Route path='write' element={<WritePage />} />
        <Route path='write/:id' element={<WritePage />} />
        <Route path='posts/create' element={<WritePage />} />
        <Route path='posts/:slug' element={<SinglePostPage />} />
        <Route path='tags/:slug' element={<TagPage />} />
        <Route path='tags' element={<AdminTagsPage />} />
        <Route path='categories/:slug' element={<CategoryPage />} />
        <Route path='search' element={<SearchResultsPage />} />
        <Route path='user' element={<UserPage />} />
        <Route path='admin/*' element={<AdminRoutes />} />
        <Route path='not-authorized' element={<NotAuthorizedPage />} />
        <Route
          path='chat/*'
          element={
            <PrivateRoute>
              <ChatRoutes />
            </PrivateRoute>
          }
        />
        {/* Fallback for unknown paths under /:lang */}
        <Route path='*' element={<NotFoundPage />} />
      </Route>
      {/* --- Fallback for unknown routes OUTSIDE /:lang: show NotFound instead of redirecting to '/' --- */}
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
};

export default PublicRoutes;
