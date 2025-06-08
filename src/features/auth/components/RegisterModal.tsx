import '../styles/RegisterModal.scss';
import { useState } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LoginModal } from './LoginModal';
import logo from '../../../assets/Logo.webp';
import { IoMdCloseCircle } from 'react-icons/io';
import { useTranslation } from 'react-i18next';

export const RegisterModal = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showLogin, setShowLogin] = useState(false);

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
      onClose();
    } catch {
      setError(t('auth.register.error'));
    }
  };

  if (showLogin) {
    return <LoginModal onClose={onClose} />;
  }

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
          <input
            className='register__input'
            type='password'
            placeholder={t('auth.register.placeholderPassword')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <span className='register__error'>{error}</span>}
          <button className='register__submit' type='submit'>
            {t('auth.register.button')}
          </button>
        </form>
        <p className='register__footer'>
          {t('auth.register.haveAccount')}{' '}
          <button type='button' onClick={() => setShowLogin(true)} className='register__link'>
            {t('auth.register.loginHere')}
          </button>
        </p>
      </div>
    </div>
  );
};
