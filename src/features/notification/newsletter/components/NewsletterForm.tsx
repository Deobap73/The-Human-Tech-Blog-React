// src/features/newsletter/components/NewsletterForm.tsx

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../../../shared/utils/axios';
import { toast } from 'react-hot-toast';
import '../styles/NewsletterForm.scss';

/**
 * NewsletterForm Component
 * Allows users to subscribe to the blog's newsletter.
 * Submits the email to the backend which sends a confirmation email (double opt-in).
 */
const NewsletterForm = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handles the newsletter subscription process.
   */
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error(t('newsletter.form.errorMissingEmail'));
      return;
    }
    setLoading(true);
    try {
      await api.post('/newsletter/subscribe', { email });
      toast.success(t('newsletter.form.confirmationMessage'));
      setEmail('');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || t('newsletter.form.errorSubscriptionFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className='newsletter-form' onSubmit={handleSubscribe} data-testid='newsletter-form'>
      <input
        className='newsletter-form__input'
        type='email'
        placeholder={t('newsletter.form.placeholder')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        required
        autoComplete='email'
      />
      <button className='newsletter-form__button' type='submit' disabled={loading}>
        {loading ? t('newsletter.form.loading') : t('newsletter.form.button')}
      </button>
    </form>
  );
};

export default NewsletterForm;
