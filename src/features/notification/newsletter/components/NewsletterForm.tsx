// src/features/newsletter/components/NewsletterForm.tsx

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../../../shared/utils/axios';
import { toast } from 'react-hot-toast';
import '../styles/NewsletterForm.scss';

type DataLayerEvent = {
  event: string;
  [key: string]: unknown;
};

function pushToDataLayer(payload: DataLayerEvent): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { dataLayer?: unknown[] };
  if (!Array.isArray(w.dataLayer)) w.dataLayer = [];
  w.dataLayer.push(payload);
}

/**
 * NewsletterForm Component
 * Allows users to subscribe to the blog's newsletter.
 * Analytics is handled by GTM using dataLayer events.
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

    // Track click intent on submit
    pushToDataLayer({
      event: 'newsletter_subscribe_click',
      link_location: 'newsletter_form',
      content_type: 'newsletter',
    });

    if (!email) {
      toast.error(t('newsletter.form.errorMissingEmail'));
      return;
    }

    setLoading(true);

    try {
      await api.post('/newsletter/subscribe', { email });

      // Track success after backend response
      pushToDataLayer({
        event: 'newsletter_subscribe_success',
        link_location: 'newsletter_form',
        content_type: 'newsletter',
      });

      toast.success(t('newsletter.form.confirmationMessage'));
      setEmail('');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || t('newsletter.form.errorSubscriptionFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className='newsletter-form'
      onSubmit={handleSubscribe}
      data-testid='newsletter-form'
      data-analytics-location='newsletter_form'>
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
      <button
        className='newsletter-form__button'
        type='submit'
        disabled={loading}
        data-analytics-event='newsletter_subscribe_click'
        data-analytics-link-text='Subscribe'
        data-analytics-link-location='newsletter_form'>
        {loading ? t('newsletter.form.loading') : t('newsletter.form.button')}
      </button>
    </form>
  );
};

export default NewsletterForm;
