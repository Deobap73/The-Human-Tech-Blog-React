// src/routes/AdminRoutes.tsx
import { Navigate, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AdminPage from '../features/admin/pages/AdminPage';
import PostForm from '../features/admin/posts/PostForm';
import DashboardHome from '../features/admin/pages/DashboardHome';
import PostsList from '../features/admin/posts/PostsList';
import AdminRoute from './adminRoute';

const AdminMessages = lazy(() => import('../features/admin/pages/AdminMessages'));
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
      <Route path='posts/create' element={<PostForm />} />
      <Route
        path='messages'
        element={
          <Suspense fallback={<div>Loading Messages...</div>}>
            <AdminMessages />
          </Suspense>
        }
      />
      <Route
        path='settings'
        element={
          <Suspense fallback={<div>Loading Settings...</div>}>
            <AdminSettings />
          </Suspense>
        }
      />
    </Route>
    <Route path='*' element={<Navigate to='/admin' />} />
  </Routes>
);

export default AdminRoutes;
