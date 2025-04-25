// src/pages/RegisterPage/RegisterPage.tsx

import './RegisterPage.scss';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios'; // Import your axios instance
import { useAuth } from '../../hooks/useAuth';
import { AxiosError } from 'axios'; // Import AxiosError for type checking

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
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/auth/register', form);
      await login(form.email, form.password);
      navigate('/');
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || 'Registration failed');
      } else if (error instanceof Error) {
        setError(error.message || 'An unexpected error occurred.');
      } else {
        setError('An unexpected error occurred.');
      }
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
        <button type='submit'>Create Account</button>
      </form>
    </div>
  );
};

export default RegisterPage;
