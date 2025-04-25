// The-Human-Tech-Blog-React/src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import LoginPage from './pages/login/LoginPage';
import AdminPage from './pages/AdminPage/AdminPage';

function App() {
  return (
    <Router>
      <div className='app'>
        <h1>The Human Tech Blog</h1>
      </div>
      <Route path='/login' element={<LoginPage />} />;
      <Route
        path='/admin'
        element={
          <PrivateRoute>
            <AdminPage />
          </PrivateRoute>
        }
      />
    </Router>
  );
}

export default App;
