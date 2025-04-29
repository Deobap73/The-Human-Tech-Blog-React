// The-Human-Tech-Blog-React/src/App.tsx

import { Routes, Route } from 'react-router-dom';

import AdminRoutes from './routes/adminRoutes';
import Navbar from './components/navbar/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/login/LoginPage';

import RegisterPage from './pages/RegisterPage/RegisterPage';

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/admin/*' element={<AdminRoutes />} />
      </Routes>
    </>
  );
}

export default App;
