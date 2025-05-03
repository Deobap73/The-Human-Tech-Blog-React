// The-Human-Tech-Blog-React/src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AdminRoutes from './routes/adminRoutes';
import { HomePage } from './pages/HomePage';
import AboutPage from './pages/about/AboutPage';
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';

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
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
