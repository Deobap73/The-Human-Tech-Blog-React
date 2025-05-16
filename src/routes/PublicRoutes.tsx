// The-Human-Tech-Blog-React/src/routes/PublicRoutes.tsx

import { Route, Routes } from 'react-router-dom';
import Layout from '../features/layout/Layout';
import { HomePage } from '../features/home/pages/HomePage';
import AboutPage from '../features/about/pages/AboutPage';
import { SinglePostPage } from '../features/post/pages/SinglePostPage';
import WritePage from '../features/post/pages/WritePage';
import AdminRoutes from './adminRoutes';

const PublicRoutes = () => (
  <Layout>
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/about' element={<AboutPage />} />
      <Route path='/posts/:slug' element={<SinglePostPage />} />
      <Route path='/write' element={<WritePage />} />
      <Route path='/admin/*' element={<AdminRoutes />} />
    </Routes>
  </Layout>
);

export default PublicRoutes;
