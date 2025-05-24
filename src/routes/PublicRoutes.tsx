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

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path='about' element={<AboutPage />} />
        <Route path='posts/:slug' element={<SinglePostPage />} />
        <Route path='write' element={<WritePage />} />
        <Route path='user' element={<UserPage />} />
        <Route path='admin/*' element={<AdminRoutes />} />
        <Route path='tags' element={<AdminTagsPage />} />
      </Route>
    </Routes>
  );
};

export default PublicRoutes;
