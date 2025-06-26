// src/routes/AdminRoutes.tsx
import { Navigate, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AdminPage from '../features/admin/pages/AdminPage';
import DashboardHome from '../features/admin/pages/DashboardHome';
import PostsList from '../features/admin/posts/PostsList';
import AdminRoute from './adminRoute';
import WritePage from '../features/post/pages/WritePage';
import DraftsList from '../features/post/components/DraftsList';
import ModerationCommentsPage from '../features/admin/pages/ModerationCommentsPage';
import AdminTagsPage from '../features/admin/pages/AdminTagsPage';
import AdminCategoriesPage from '../features/admin/pages/AdminCategoriesPage';
import DebugPage from './DebugPage';

// Dynamic imports for better performance
const AdminChatPage = lazy(() => import('../features/chat/pages/ChatRoutes'));
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
      <Route path='posts' element={<PostsList />} />
      <Route path='posts/create' element={<WritePage />} />
      <Route path='write/:id' element={<WritePage />} />
      <Route path='drafts' element={<DraftsList />} />
      <Route path='posts/edit/:id' element={<DebugPage />} />
      <Route path='tags' element={<AdminTagsPage />} />
      <Route path='categories' element={<AdminCategoriesPage />} />
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
