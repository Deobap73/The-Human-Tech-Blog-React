// src/routes/adminRoutes.tsx
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminPage from '../features/admin/pages/AdminPage';
import PostForm from '../features/admin/posts/PostForm';
import DashboardHome from '../features/admin/pages/DashboardHome';
import PostsList from '../features/admin/posts/PostsList';
import AdminRoute from './adminRoute';

const AdminRoutes = () => {
  return (
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
      </Route>
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  );
};

export default AdminRoutes;
