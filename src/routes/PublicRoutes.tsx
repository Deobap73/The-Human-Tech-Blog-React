import { Routes, Route } from 'react-router-dom';
import Layout from '../features/layout/Layout';
import HomePage from '../features/home/pages/HomePage';
import AboutPage from '../features/about/pages/AboutPage';
import SinglePostPage from '../features/post/pages/SinglePostPage';
import WritePage from '../features/post/pages/WritePage';
import DraftsList from '../features/post/components/DraftsList';
import QuickPostsPage from '../features/post/pages/QuickPostsPage';
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

const NotFoundPage = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>404 - Page Not Found</h1>
  </div>
);

const SupportedLangs = ['en', 'pt', 'de', 'es'];

const PublicRoutes = () => (
  <Routes>
    {/* Root: Redirect to browser language */}
    <Route path='/' element={<RedirectToBrowserLang />} />
    <Route path='/not-authorized' element={<RedirectToBrowserLang path='not-authorized' />} />
    <Route path='/admin/*' element={<RedirectToBrowserLang path='admin' />} />

    {/* All multilanguage content inside /:lang */}
    <Route path='/:lang' element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path='about' element={<AboutPage />} />
      <Route path='contact' element={<ContactPage />} />

      {/* Drafts: always use /:lang/drafts */}
      <Route path='drafts' element={<DraftsList />} />

      {/* Create & Edit: /:lang/write ou /:lang/write/:id */}
      <Route path='write' element={<WritePage />} />
      <Route path='write/:id' element={<WritePage />} />

      <Route path='posts/create' element={<WritePage />} />
      <Route path='posts/:slug' element={<SinglePostPage />} />
      <Route path='shorts' element={<QuickPostsPage />} />
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
      <Route path='*' element={<NotFoundPage />} />
    </Route>

    {/* Fallback for unknown routes OUTSIDE /:lang */}
    <Route path='*' element={<NotFoundPage />} />
  </Routes>
);

export default PublicRoutes;
