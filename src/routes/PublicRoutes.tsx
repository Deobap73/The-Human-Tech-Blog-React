// src/routes/PublicRoutes.tsx

import { Routes, Route } from 'react-router-dom';
import Layout from '../features/layout/Layout';
import { HomePage } from '../features/home/pages/HomePage';
import AboutPage from '../features/about/pages/AboutPage';
import { SinglePostPage } from '../features/post/pages/SinglePostPage';
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
import ChatPage from '../features/chat/pages/ChatPage';

// PATCH AQUI — Redireciona /admin para idioma
const SupportedLangs = ['en', 'pt', 'de', 'es'];

const PublicRoutes = () => {
  return (
    <Routes>
      {/* REDIRECT: /admin -> /[lang]/admin */}
      <Route path='/admin/*' element={<RedirectToBrowserLang path='admin' />} />

      <Route path='/:lang' element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path='about' element={<AboutPage />} />
        <Route path='contact' element={<ContactPage />} />
        <Route path='write' element={<WritePage />} />
        <Route path='posts/create' element={<WritePage />} />
        <Route path='posts/:slug' element={<SinglePostPage />} />
        <Route path='user' element={<UserPage />} />
        <Route path='admin/*' element={<AdminRoutes />} />
        <Route path='tags/:slug' element={<TagPage />} />
        <Route path='tags' element={<AdminTagsPage />} />
        <Route path='categories/:slug' element={<CategoryPage />} />
        <Route path='search' element={<SearchResultsPage />} />
        <Route
          path='chat'
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />
        <Route path='*' element={<NavigateToDefaultLang />} />
      </Route>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/' element={<RedirectToBrowserLang />} />
    </Routes>
  );
};

export default PublicRoutes;
