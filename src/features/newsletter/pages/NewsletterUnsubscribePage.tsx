// src/features/newsletter/pages/NewsletterUnsubscribePage.tsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../../shared/utils/axios';
import '../styles/NewsletterPages.scss';

/**
 * NewsletterUnsubscribePage
 * Handles the unsubscription from the newsletter via token link.
 */
const NewsletterUnsubscribePage = () => {
  const { t } = useTranslation();
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const unsubscribe = async () => {
      try {
        await api.post(`/newsletter/unsubscribe/${token}`);
        setStatus('success');
        setMessage(t('newsletter.unsubscribe.success'));
      } catch (err: any) {
        setStatus('error');
        setMessage(err?.response?.data?.message || t('newsletter.unsubscribe.error'));
      }
    };
    if (token) unsubscribe();
    else {
      setStatus('error');
      setMessage(t('newsletter.unsubscribe.errorNoToken'));
    }
  }, [token, t]);

  return (
    <div className='newsletter-page'>
      <div className='newsletter-page__container'>
        {status === 'loading' && (
          <div className='newsletter-page__loading'>{t('newsletter.unsubscribe.loading')}</div>
        )}
        {status === 'success' && <div className='newsletter-page__success'>{message}</div>}
        {status === 'error' && <div className='newsletter-page__error'>{message}</div>}
      </div>
    </div>
  );
};

export default NewsletterUnsubscribePage;
