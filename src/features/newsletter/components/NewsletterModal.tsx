// src/features/newsletter/components/NewsletterModal.tsx

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NewsletterForm from './NewsletterForm';
import '../styles/NewsletterModal.scss';

/**
 * NewsletterModal
 * Renders a modal to subscribe to the newsletter.
 * Appears automatically after a short delay or on exit intent.
 */
const NewsletterModal = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  // Trigger modal after 15 seconds OR on exit intent (mouse leaves window)
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 15000);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 30) setVisible(true);
    };

    window.addEventListener('mouseout', handleMouseLeave);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  const handleClose = () => setVisible(false);

  if (!visible) return null;

  return (
    <div className='newsletter-modal' role='dialog' aria-modal='true'>
      <div className='newsletter-modal__backdrop' onClick={handleClose} />
      <div className='newsletter-modal__content'>
        <button
          className='newsletter-modal__close'
          aria-label={t('newsletter.form.close', 'Close')}
          onClick={handleClose}>
          ×
        </button>
        <h2 className='newsletter-modal__title'>
          {t('newsletter.modal.title', 'Join our newsletter')}
        </h2>
        <p className='newsletter-modal__desc'>
          {t(
            'newsletter.modal.description',
            'Get fresh tech reflections and exclusive content straight to your inbox. No spam, ever.'
          )}
        </p>
        <NewsletterForm />
      </div>
    </div>
  );
};

export default NewsletterModal;
