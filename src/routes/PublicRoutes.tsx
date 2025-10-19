// /src/routes/PublicRoutes.tsx

import { Routes, Route } from 'react-router-dom';
import SitemapProxyRoutes from './SitemapProxyRoutes';

import Layout from '../features/layout/Layout';
import HomePage from '../features/home/pages/HomePage';
import AboutPage from '../features/about/pages/AboutPage';
import ContactPage from '../features/contact/pages/ContactPage';
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
import PrivateRoute from './PrivateRoute';
import ChatRoutes from '../features/chat/pages/ChatRoutes';
import NotAuthorizedPage from '../pages/NotAuthorizedPage';
import NewsletterConfirmPage from '../features/notification/newsletter/pages/NewsletterConfirmPage';
import NewsletterUnsubscribePage from '../features/notification/newsletter/pages/NewsletterUnsubscribePage';
import AiPromptsPage from '../features/aiPrompts/pages/AiPromptsPage';
import ProjectsPage from '../features/projects/pages/ProjectsPage';

// ATS Generator Page (will be created in next step)

/* import AtsGeneratorPage from '../features/ats/pages/AtsGeneratorPage'; */

const NotFoundPage = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>404 - Page Not Found</h1>
  </div>
);

const PublicRoutes = () => (
  <Routes>
    {/* Forward sitemap routes to the backend for Google Search Console */}
    <Route path='/sitemap-posts.xml' element={<SitemapProxyRoutes />} />
    <Route path='/sitemap-quickposts.xml' element={<SitemapProxyRoutes />} />
    <Route path='/sitemap-prompts.xml' element={<SitemapProxyRoutes />} />
    <Route path='/sitemap-categories.xml' element={<SitemapProxyRoutes />} />
    <Route path='/sitemap-static.xml' element={<SitemapProxyRoutes />} />

    {/* Redirect root and top-level routes without lang prefix */}
    <Route path='/' element={<RedirectToBrowserLang />} />
    <Route path='/not-authorized' element={<RedirectToBrowserLang />} />
    <Route path='/admin/*' element={<RedirectToBrowserLang />} />
    <Route path='/posts/:slug' element={<RedirectToBrowserLang />} />

    {/* Support short URLs without lang prefix (redirects to browser language) */}
    <Route path='about' element={<RedirectToBrowserLang />} />
    <Route path='contact' element={<RedirectToBrowserLang />} />
    <Route path='posts/:slug' element={<RedirectToBrowserLang />} />
    <Route path='/shorts' element={<RedirectToBrowserLang />} />
    <Route path='/aiprompts' element={<RedirectToBrowserLang />} />
    {/* NEW: short URL for ATS generator */}
    <Route path='/ats' element={<RedirectToBrowserLang />} />

    {/* All multilanguage content inside /:lang */}
    <Route path='/:lang' element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path='about' element={<AboutPage />} />
      <Route path='contact' element={<ContactPage />} />
      <Route path='drafts' element={<DraftsList />} />
      <Route path='write' element={<WritePage />} />
      <Route path='write/:id' element={<WritePage />} />
      <Route path='posts/create' element={<WritePage />} />
      <Route path='aiprompts' element={<AiPromptsPage />} />
      <Route path='posts/:slug' element={<SinglePostPage />} />
      <Route path='shorts' element={<QuickPostsPage />} />
      <Route path='tags/:slug' element={<TagPage />} />
      <Route path='tags' element={<AdminTagsPage />} />
      <Route path='categories/:slug' element={<CategoryPage />} />
      <Route path='search' element={<SearchResultsPage />} />
      <Route path='user' element={<UserPage />} />
      <Route path='admin/*' element={<AdminRoutes />} />
      <Route path='not-authorized' element={<NotAuthorizedPage />} />
      <Route path='newsletter/confirm/:token' element={<NewsletterConfirmPage />} />
      <Route path='newsletter/unsubscribe/:token' element={<NewsletterUnsubscribePage />} />
      <Route path='projects' element={<ProjectsPage />} />

      {/* Protected chat area */}
      <Route
        path='chat/*'
        element={
          <PrivateRoute>
            <ChatRoutes />
          </PrivateRoute>
        }
      />

      {/* ATS Generator route (multilingual path) */}
      {/*   <Route path="ats" element={<AtsGeneratorPage />} /> */}

      {/* 404 inside /:lang */}
      <Route path='*' element={<NotFoundPage />} />
    </Route>

    {/* Fallback for unknown routes outside /:lang */}
    <Route path='*' element={<NotFoundPage />} />
  </Routes>
);

export default PublicRoutes;
