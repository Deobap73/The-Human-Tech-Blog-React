// The-Human-Tech-Blog-React/src/App.tsx

import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './shared/context/AuthProvider';
import { ThemeProvider } from './shared/context/ThemeProvider';
import AdminRoutes from './routes/adminRoutes';
import { HomePage } from './features/home/pages/HomePage';
import AboutPage from './features/about/pages/AboutPage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import { SinglePostPage } from './features/post/pages/SinglePostPage';
import Layout from './features/layout/Layout';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path='about' element={<AboutPage />} />
        <Route path='posts/:slug' element={<SinglePostPage />} />
      </Route>

      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/admin/*' element={<AdminRoutes />} />
    </Routes>
  );
}

export default App;
