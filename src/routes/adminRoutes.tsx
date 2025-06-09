// src/routes/AdminRoutes.tsx
import { Navigate, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AdminPage from '../features/admin/pages/AdminPage';
import DashboardHome from '../features/admin/pages/DashboardHome';
import PostsList from '../features/admin/posts/PostsList';
import AdminRoute from './adminRoute';
import WritePage from '../features/post/pages/WritePage';
import ModerationCommentsPage from '../features/admin/pages/ModerationCommentsPage';

// Dynamic imports for better performance
const AdminChatPage = lazy(() => import('../features/chat/pages/ChatPage'));
const AdminSettings = lazy(() => import('../features/admin/pages/AdminSettings'));

const AdminRoutes = () => (
  <Routes>
    <Route
      path='/'
      element={
        <AdminRoute>
          <AdminPage />
        </AdminRoute>
      }>
      <Route index element={<DashboardHome />} />
      {/* Ordem importante! */}
      <Route path='posts' element={<PostsList />} />
      <Route path='posts/create' element={<WritePage />} />
      <Route path='posts/edit/:id' element={<WritePage />} />
      {/* Não incluir posts/:slug aqui! */}
      <Route
        path='messages'
        element={
          <Suspense fallback={<div className='route-loader'>Loading Messages...</div>}>
            <AdminChatPage />
          </Suspense>
        }
      />
      <Route path='comments/moderate' element={<ModerationCommentsPage />} />
      <Route
        path='settings'
        element={
          <Suspense fallback={<div className='route-loader'>Loading Settings...</div>}>
            <AdminSettings />
          </Suspense>
        }
      />
    </Route>
    {/* Redirect everything else to /admin root */}
    <Route path='*' element={<Navigate to='/admin' />} />
  </Routes>
);

export default AdminRoutes;
