// The-Human-Tech-Blog-React/src/components/auth/LoginModal.tsx

import '../styles/LoginModal.scss';
import { useState } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { RegisterModal } from './RegisterModal';

export const LoginModal = ({ onClose }: { onClose: () => void }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Invalid credentials');
    }
  };

  if (showRegister) {
    return <RegisterModal onClose={onClose} />;
  }

  const handleOAuthLogin = (provider: 'google' | 'github') => {
    window.open(`${import.meta.env.VITE_API_BASE_URL}/auth/${provider}`, '_self');
  };

  return (
    <>
      <div className='modal-overlay'>
        <div className='modal'>
          <button className='modal__close' onClick={onClose}>
            ×
          </button>
          <h2 className='modal__title'>Login</h2>
          <form className='modal__form' onSubmit={handleSubmit}>
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
              Login
            </button>
          </form>

          <div className='modal__oauth'>
            <p className='modal__oauth-label'>Or login with</p>
            <div className='modal__oauth-buttons'>
              <button
                className='modal__oauth-btn modal__oauth-btn--google'
                onClick={() => handleOAuthLogin('google')}>
                Google
              </button>
              <button
                className='modal__oauth-btn modal__oauth-btn--github'
                onClick={() => handleOAuthLogin('github')}>
                GitHub
              </button>
            </div>
          </div>

          <div className='modal__register-link'>
            <p>
              Don't have an account?{' '}
              <button onClick={() => setShowRegister(true)}>Create one</button>
            </p>
          </div>
        </div>
      </div>
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </>
  );
};
