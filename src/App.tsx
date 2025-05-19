// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import LoginPage from "@/features/auth/pages/LoginPage';
import RegisterPage from "@/features/auth/pages/RegisterPage';
import PublicRoutes from './routes/PublicRoutes';

function App() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/*' element={<PublicRoutes />} />
    </Routes>
  );
}

export default App;
