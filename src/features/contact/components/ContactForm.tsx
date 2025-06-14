// /src/features/contact/components/ContactForm.tsx

import '../styles/ContactForm.scss';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

export const ContactForm = () => {
  const { t } = useTranslation();
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper para endpoint CSRF correto conforme ambiente
  const getCsrfEndpoint = () => {
    if (import.meta.env.PROD) {
      return 'https://api.thehumantechblog.com/api/auth/csrf';
    }
    // Em dev, vai pelo proxy do Vite (localhost)
    return '/api/auth/csrf';
  };

  // Obter CSRF token ao montar componente
  useEffect(() => {
    fetch(getCsrfEndpoint(), { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to get CSRF token');
        return res.json();
      })
      .then((data) => setCsrfToken(data.csrfToken))
      .catch(() => setError('Failed to get CSRF token.'));
    // eslint-disable-next-line
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(
        import.meta.env.PROD ? 'https://api.thehumantechblog.com/api/contact' : '/api/contact',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken,
          },
          credentials: 'include',
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.message || 'Failed to send');
      }
      setSuccess(t('contact.form.success'));
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Send failed');
    }
  };

  return (
    <form className='contact-form' autoComplete='off' onSubmit={handleSubmit}>
      <h2 className='contact-form__title'>{t('contact.form.title')}</h2>
      <p className='contact-form__desc'>{t('contact.form.desc')}</p>
      <input
        type='text'
        className='contact-form__input'
        placeholder={t('contact.form.placeholderName')}
        name='name'
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        type='email'
        className='contact-form__input'
        placeholder={t('contact.form.placeholderEmail')}
        name='email'
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        type='text'
        className='contact-form__input'
        placeholder={t('contact.form.placeholderSubject')}
        name='subject'
        value={form.subject}
        onChange={handleChange}
      />
      <textarea
        className='contact-form__input contact-form__textarea'
        placeholder={t('contact.form.placeholderMessage')}
        name='message'
        value={form.message}
        onChange={handleChange}
        required
      />
      <button className='contact-form__button' type='submit' disabled={!csrfToken}>
        {t('contact.form.button')}
      </button>
      {success && <div className='success-text'>{success}</div>}
      {error && <div className='error-text'>{error}</div>}
    </form>
  );
};
