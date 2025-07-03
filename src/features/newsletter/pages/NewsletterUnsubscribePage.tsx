// src/features/newsletter/pages/NewsletterUnsubscribePage.tsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../shared/utils/axios';
import '../styles/NewsletterPages.scss';

/**
 * NewsletterUnsubscribePage
 * Handles the unsubscription from the newsletter via token link.
 */
const NewsletterUnsubscribePage = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const unsubscribe = async () => {
      try {
        await api.post(`/newsletter/unsubscribe/${token}`);
        setStatus('success');
        setMessage('You have been unsubscribed from our newsletter.');
      } catch (err: any) {
        setStatus('error');
        setMessage(
          err?.response?.data?.message ||
            'Invalid or expired unsubscribe link. Your email may already be removed.'
        );
      }
    };
    if (token) unsubscribe();
    else {
      setStatus('error');
      setMessage('No unsubscribe token provided.');
    }
  }, [token]);

  return (
    <div className='newsletter-page'>
      <div className='newsletter-page__container'>
        {status === 'loading' && (
          <div className='newsletter-page__loading'>Processing your request...</div>
        )}
        {status === 'success' && <div className='newsletter-page__success'>{message}</div>}
        {status === 'error' && <div className='newsletter-page__error'>{message}</div>}
      </div>
    </div>
  );
};

export default NewsletterUnsubscribePage;
