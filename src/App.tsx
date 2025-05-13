// The-Human-Tech-Blog-React/src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './shared/context/AuthContext';
import { ThemeProvider } from './shared/context/ThemeProvider';
import AdminRoutes from './routes/adminRoutes';
import { HomePage } from './features/home/pages/HomePage';
import AboutPage from './features/about/pages/AboutPage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import { SinglePostPage } from './features/post/pages/SinglePostPage';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/admin/*' element={<AdminRoutes />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/posts/:slug' element={<SinglePostPage />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
