// src/features/newsletter/pages/NewsletterConfirmPage.tsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../../shared/utils/axios';
import '../styles/NewsletterPages.scss';

/**
 * NewsletterConfirmPage
 * Handles the confirmation of newsletter subscription via token link.
 */
const NewsletterConfirmPage = () => {
  const { t } = useTranslation();
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const confirm = async () => {
      try {
        await api.get(`/newsletter/confirm/${token}`);
        setStatus('success');
        setMessage(t('newsletter.confirm.success'));
      } catch (err: any) {
        setStatus('error');
        setMessage(err?.response?.data?.message || t('newsletter.confirm.error'));
      }
    };
    if (token) confirm();
    else {
      setStatus('error');
      setMessage(t('newsletter.confirm.errorNoToken'));
    }
  }, [token, t]);

  return (
    <div className='newsletter-page'>
      <div className='newsletter-page__container'>
        {status === 'loading' && (
          <div className='newsletter-page__loading'>{t('newsletter.confirm.loading')}</div>
        )}
        {status === 'success' && <div className='newsletter-page__success'>{message}</div>}
        {status === 'error' && <div className='newsletter-page__error'>{message}</div>}
      </div>
    </div>
  );
};

export default NewsletterConfirmPage;
