// src/components/auth/LoginModal.tsx

import '../styles/LoginModal.scss';
import { useState } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { RegisterModal } from './RegisterModal';
import logo from '../../../assets/Logo.webp';
import { IoMdCloseCircle } from 'react-icons/io';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export const LoginModal = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
      onClose();
    } catch {
      setError(t('auth.login.error'));
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
      <div className='login-overlay'>
        <div className='modal'>
          <div className='modal__onOff'>
            <IoMdCloseCircle className='modal__close' onClick={onClose} />
          </div>
          <div className='modal__logo'>
            <img
              src={logo}
              alt={t('auth.logoAlt')}
              className='modal__logo-image'
              draggable={false}
            />
          </div>
          <h2 className='modal__title'>{t('auth.login.title')}</h2>
          <form className='modal__form' onSubmit={handleSubmit}>
            <input
              className='modal__input'
              type='email'
              placeholder={t('auth.login.placeholderEmail')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className='modal__password-wrapper'>
              <input
                className='modal__input modal__input--password'
                type={showPassword ? 'text' : 'password'}
                placeholder={t('auth.login.placeholderPassword')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete='current-password'
              />
              <button
                type='button'
                className='modal__password-toggle'
                aria-label={
                  showPassword ? t('auth.login.hidePassword') : t('auth.login.showPassword')
                }
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={0}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <button className='modal__submit' type='submit'>
              {t('auth.login.button')}
            </button>
            {error && (
              <span className='modal__error' role='alert' aria-live='assertive'>
                {error}
              </span>
            )}
          </form>

          <div className='modal__oauth'>
            <p className='modal__oauth-label'>{t('auth.login.orWith')}</p>
            <div className='modal__oauth-buttons'>
              <button
                className='modal__oauth-btn modal__oauth-btn--google'
                onClick={() => handleOAuthLogin('google')}>
                {t('auth.login.google')}
              </button>
              <button
                className='modal__oauth-btn modal__oauth-btn--github'
                onClick={() => handleOAuthLogin('github')}>
                {t('auth.login.github')}
              </button>
            </div>
          </div>

          <div className='modal__register-link'>
            <p>
              {t('auth.login.noAccount')}{' '}
              <button onClick={() => setShowRegister(true)}>{t('auth.login.createAccount')}</button>
            </p>
          </div>
        </div>
      </div>
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </>
  );
};
