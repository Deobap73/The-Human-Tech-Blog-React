// The-Human-Tech-Blog-React/src/components/auth/RegisterModal.tsx

import './RegisterModal.scss';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const RegisterModal = ({ onClose }: { onClose: () => void }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) throw new Error('Registration failed');

      await login(email, password);
      navigate('/');
    } catch {
      setError('Registration failed');
    }
  };

  return (
    <div className='modal-overlay'>
      <div className='modal'>
        <button className='modal__close' onClick={onClose}>
          ×
        </button>
        <h2 className='modal__title'>Register</h2>
        <form className='modal__form' onSubmit={handleSubmit}>
          <input
            className='modal__input'
            type='text'
            placeholder='Full Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className='modal__input'
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className='modal__input'
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <span className='modal__error'>{error}</span>}
          <button className='modal__submit' type='submit'>
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};
