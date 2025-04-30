// The-Human-Tech-Blog-React/src/pages/RegisterPage/RegisterPage.tsx
import './RegisterPage.scss';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import { useAuth } from '../../hooks/useAuth';
import { AxiosError } from 'axios';

interface FormValues {
  name: string;
  email: string;
  password: string;
  avatar: string;
}

const RegisterPage = () => {
  const { login } = useAuth();
  const [form, setForm] = useState<FormValues>({ name: '', email: '', password: '', avatar: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      await login(form.email, form.password);
      navigate('/');
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || 'Registration failed');
      } else if (error instanceof Error) {
        setError(error.message || 'Unexpected error occurred');
      } else {
        setError('Unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='register-container'>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type='text'
          name='name'
          placeholder='Name'
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type='email'
          name='email'
          placeholder='Email'
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type='password'
          name='password'
          placeholder='Password'
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type='text'
          name='avatar'
          placeholder='Avatar URL (optional)'
          value={form.avatar}
          onChange={handleChange}
        />
        {error && <div className='error'>{error}</div>}
        <button type='submit' disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
