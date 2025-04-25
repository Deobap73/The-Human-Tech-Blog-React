// The-Human-Tech-Blog-React/src/pages/login/LoginPage.tsx

import './loginPage.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/'); // Redireciona após login
    } catch (error) {
      // Changed 'err' to 'error'
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || 'Login failed');
      } else if (error instanceof Error) {
        setError(error.message || 'An unexpected error occurred.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className='login-container'>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <div className='error'>{error}</div>}

        <button type='submit'>Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
