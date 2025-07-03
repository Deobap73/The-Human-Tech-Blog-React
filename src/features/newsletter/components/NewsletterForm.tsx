// src/features/newsletter/components/NewsletterForm.tsx

import { useState } from 'react';
import api from '../../../shared/utils/axios';
import { toast } from 'react-hot-toast';
import '../styles/NewsletterForm.scss';

/**
 * NewsletterForm Component
 * Allows users to subscribe to the blog's newsletter.
 * Submits the email to the backend which sends a confirmation email (double opt-in).
 */
const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handles the newsletter subscription process.
   * - Prevents default form submission.
   * - Validates email presence.
   * - Sends POST request to backend.
   * - Shows user feedback with toast notifications.
   */
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/newsletter/subscribe', { email });
      toast.success(
        'Check your inbox! Please confirm your subscription via the link sent to your email.'
      );
      setEmail('');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Subscription failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className='newsletter-form' onSubmit={handleSubscribe} data-testid='newsletter-form'>
      <input
        className='newsletter-form__input'
        type='email'
        placeholder='Your email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        required
        autoComplete='email'
      />
      <button className='newsletter-form__button' type='submit' disabled={loading}>
        {loading ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  );
};

export default NewsletterForm;
