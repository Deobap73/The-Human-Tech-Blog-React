// /src/features/contact/components/ContactForm.tsx
'use strict';

import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { safeApiPost } from '../../../shared/utils/apiHelpers';
import '../styles/ContactForm.scss';

interface ContactPayload {
  name: string;
  email: string;
  message: string;
  // subject is optional in UI, but we do NOT send it to backend anymore
  subject?: string;
}

export const ContactForm: React.FC = () => {
  const { t } = useTranslation();

  const [form, setForm] = useState<ContactPayload>({
    name: '',
    email: '',
    message: '',
    subject: '', // kept only for UI display; not sent
  });
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
      // Send only name, email, message
      await safeApiPost('/contact', {
        name: form.name,
        email: form.email,
        message: form.message,
        // subject intentionally omitted (controller builds the final subject)
      });

      setSuccess(t('contact.form.success'));
      setForm({ name: '', email: '', message: '', subject: '' });
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

      {/* Optional UI field. Kept for user context only, not sent to server. */}
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
