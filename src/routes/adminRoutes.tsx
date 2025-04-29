// The-Human-Tech-Blog-React/src/routes/adminRoutes.tsx

import { Navigate, Route, Routes } from 'react-router-dom';
import AdminPage from '../pages/AdminPage/AdminPage';
import PrivateRoute from './PrivateRoute';
import DashboardHome from '../pages/AdminPage/dashboard/DashboardHome';

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
        {/* Futuras rotas: <Route path="posts" element={<PostManager />} /> */}
      </Route>
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  );
};

export default AdminRoutes;
