// src/features/newsletter/pages/NewsletterConfirmPage.tsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../shared/utils/axios';
import '../styles/NewsletterPages.scss';

/**
 * NewsletterConfirmPage
 * Handles the confirmation of newsletter subscription via token link.
 */
const NewsletterConfirmPage = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const confirm = async () => {
      try {
        await api.get(`/newsletter/confirm/${token}`);
        setStatus('success');
        setMessage('Subscription confirmed! Thank you for joining our newsletter.');
      } catch (err: any) {
        setStatus('error');
        setMessage(
          err?.response?.data?.message ||
            'Invalid or expired confirmation link. Please try subscribing again.'
        );
      }
    };
    if (token) confirm();
    else {
      setStatus('error');
      setMessage('No confirmation token provided.');
    }
  }, [token]);

  return (
    <div className='newsletter-page'>
      <div className='newsletter-page__container'>
        {status === 'loading' && (
          <div className='newsletter-page__loading'>Confirming your subscription...</div>
        )}
        {status === 'success' && <div className='newsletter-page__success'>{message}</div>}
        {status === 'error' && <div className='newsletter-page__error'>{message}</div>}
      </div>
    </div>
  );
};

export default NewsletterConfirmPage;
