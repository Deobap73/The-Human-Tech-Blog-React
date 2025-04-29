// The-Human-Tech-Blog-React/src/routes/adminRoutes.tsx

import { Navigate, Route, Routes } from 'react-router-dom';
import AdminPage from '../pages/AdminPage/AdminPage';
import PostForm from '../pages/AdminPage/posts/PostForm';
import PrivateRoute from './PrivateRoute';
import DashboardHome from '../pages/AdminPage/dashboard/DashboardHome';
import PostsList from '../pages/AdminPage/posts/PostsList';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path='/admin'
        element={
          <PrivateRoute>
            <AdminPage />
          </PrivateRoute>
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
