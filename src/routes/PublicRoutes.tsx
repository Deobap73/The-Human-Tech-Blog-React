// src/routes/PublicRoutes.tsx

import { Routes, Route, useParams, Navigate } from 'react-router-dom';
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

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path='/:lang' element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path='about' element={<AboutPage />} />
        <Route path='posts/:slug' element={<SinglePostPage />} />
        <Route path='write' element={<WritePage />} />
        <Route path='user' element={<UserPage />} />
        <Route path='admin/*' element={<AdminRoutes />} />
        <Route path='tags/:slug' element={<TagPage />} />
        <Route path='tags' element={<AdminTagsPage />} />
        <Route path='categories/:slug' element={<CategoryPage />} />
        <Route path='search' element={<SearchResultsPage />} />
        {/* Redireciona rotas desconhecidas para home do idioma atual */}
        <Route path='*' element={<NavigateToDefaultLang />} />
      </Route>
      {/* Redireciona root para /en ou o idioma detectado */}
      <Route path='/' element={<RedirectToBrowserLang />} />
    </Routes>
  );
};

export default PublicRoutes;
