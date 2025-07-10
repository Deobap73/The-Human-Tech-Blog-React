// src/features/auth/components/LoginModal.tsx

import '../styles/LoginModal.scss';
import { useState } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useLoginModal } from '../../../shared/hooks/useLoginModal';
import logo from '../../../assets/Logo.webp';
import { IoMdCloseCircle } from 'react-icons/io';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { getRecaptchaToken } from '../../../shared/utils/recaptcha'; // Importa helper

// >>> INSERE A TUA CHAVE SITE KEY v3 AQUI <<<
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;

export const LoginModal = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { openRegister } = useLoginModal();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // reCAPTCHA v3: obtém token
      const captcha = await getRecaptchaToken(RECAPTCHA_SITE_KEY, 'login');
      await login(email, password, captcha); // Ajusta useAuth/login para receber o token!
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || t('auth.login.error') || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider: 'google' | 'github') => {
    window.open(`${import.meta.env.VITE_API_BASE_URL}/auth/${provider}`, '_self');
  };

  return (
    <div className='login-overlay'>
      <div className='modal'>
        <div className='modal__onOff'>
          <IoMdCloseCircle className='modal__close' onClick={onClose} />
        </div>
        <div className='modal__logo'>
          <img src={logo} alt={t('auth.logoAlt')} className='modal__logo-image' draggable={false} />
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
            autoComplete='username'
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
          <button className='modal__submit' type='submit' disabled={loading}>
            {loading ? t('auth.login.loading') || 'Logging in...' : t('auth.login.button')}
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
            <button type='button' className='modal__link' onClick={openRegister}>
              {t('auth.login.createAccount')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
