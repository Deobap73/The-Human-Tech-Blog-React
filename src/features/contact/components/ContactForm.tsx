// /src/features/contact/components/ContactForm.tsx

import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { safeApiPost } from '../../../shared/utils/apiHelpers';
import '../styles/ContactForm.scss';

export const ContactForm = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await safeApiPost('/contact', form);
      setSuccess(t('contact.form.success'));
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setError(
        err?.response?.data?.error || err?.response?.data?.message || err.message || 'Send failed'
      );
    } finally {
      setLoading(false);
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
      <button className='contact-form__button' type='submit' disabled={loading}>
        {loading ? t('contact.form.sending') || 'Sending...' : t('contact.form.button')}
      </button>
      {success && <div className='success-text'>{success}</div>}
      {error && <div className='error-text'>{error}</div>}
    </form>
  );
};
