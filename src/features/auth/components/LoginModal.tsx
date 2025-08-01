// src/features/auth/components/LoginModal.tsx

import '../styles/LoginModal.scss';
import { useState, useRef } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useLoginModal } from '../../../shared/hooks/useLoginModal';
import logo from '../../../assets/Logo.webp';
import { IoMdCloseCircle } from 'react-icons/io';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import RecaptchaV3 from '../../../shared/components/RecaptchaV3';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;

/**
 * LoginModal component for user authentication.
 * Uses Google reCAPTCHA v3 and prevents infinite recaptcha loops.
 */
export const LoginModal = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { openRegister } = useLoginModal();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Prevent recaptcha from looping: only set once per modal opening
  const captchaSet = useRef(false);

  /**
   * Callback for reCAPTCHA token.
   * Sets the token only once per modal session.
   */
  const handleCaptcha = (token: string) => {
    if (!captchaSet.current) {
      setCaptchaToken(token);
      captchaSet.current = true;
    }
  };

  /**
   * Handles form submission for login.
   * Only submits if a valid captchaToken is present.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!captchaToken) {
        setError('Captcha validation failed.');
        setLoading(false);
        return;
      }
      await login(email, password, captchaToken);
      onClose();
    } catch {
      // Do NOT reset captchaToken here to avoid infinite loop!
      setError(t('auth.login.error'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles OAuth login via Google or GitHub.
   */
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
          {/* reCAPTCHA v3: Only render if not already set */}
          {!captchaSet.current && (
            <RecaptchaV3 siteKey={RECAPTCHA_SITE_KEY} action='login' onToken={handleCaptcha} />
          )}
          <button className='modal__submit' type='submit' disabled={loading || !captchaToken}>
            {loading ? t('auth.login.loading') : t('auth.login.button')}
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
