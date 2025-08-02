// src/features/auth/components/RegisterModal.tsx

import '../styles/RegisterModal.scss';
import { useState } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useLoginModal } from '../../../shared/hooks/useLoginModal';
import logo from '../../../assets/Logo.webp';
import { IoMdCloseCircle } from 'react-icons/io';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export const RegisterModal = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const { register, login } = useAuth();
  const { open, closeRegister } = useLoginModal();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ name, email, password });
      await login(email, password);
      onClose();
    } catch {
      setError(t('auth.register.error'));
    }
  };

  return (
    <div className='register-overlay'>
      <div className='register'>
        <div className='register__onOff'>
          <IoMdCloseCircle className='register__close' onClick={onClose} />
        </div>
        <div className='register__logo'>
          <img
            src={logo}
            alt={t('auth.logoAlt')}
            className='register__logo-image'
            draggable={false}
            loading='lazy'
          />
        </div>
        <h2 className='register__title'>{t('auth.register.title')}</h2>
        <p className='register__sentence'>{t('auth.register.sentence')}</p>
        <form className='register__form' onSubmit={handleSubmit}>
          <input
            className='register__input'
            type='text'
            placeholder={t('auth.register.placeholderName')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className='register__input'
            type='email'
            placeholder={t('auth.register.placeholderEmail')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className='register__password-wrapper'>
            <input
              className='register__input register__input--password'
              type={showPassword ? 'text' : 'password'}
              placeholder={t('auth.register.placeholderPassword')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete='new-password'
            />
            <button
              type='button'
              className='register__password-toggle'
              aria-label={
                showPassword ? t('auth.register.hidePassword') : t('auth.register.showPassword')
              }
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={0}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {error && <span className='register__error'>{error}</span>}
          <button className='register__submit' type='submit'>
            {t('auth.register.button')}
          </button>
        </form>
        <p className='register__footer'>
          {t('auth.register.haveAccount')}{' '}
          <button type='button' className='register__link' onClick={open}>
            {t('auth.register.loginHere')}
          </button>
        </p>
      </div>
    </div>
  );
};
