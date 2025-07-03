// src/features/newsletter/components/NewsletterModal.tsx

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NewsletterForm from './NewsletterForm';
import '../styles/NewsletterModal.scss';

const MODAL_DELAY_MS = 60000; // 60 segundos
const LOCALSTORAGE_KEY = 'newsletterModalDismissed';

const NewsletterModal = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  // Só mostra o modal se não tiver sido descartado
  useEffect(() => {
    // Se já foi fechado, não mostra
    if (localStorage.getItem(LOCALSTORAGE_KEY) === '1') return;

    const timer = setTimeout(() => setVisible(true), MODAL_DELAY_MS);

    // Exit intent: mostra só se ainda não mostrou/modal não está aberto
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 30 && !visible) {
        setVisible(true);
        clearTimeout(timer);
      }
    };

    window.addEventListener('mouseout', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mouseout', handleMouseLeave);
    };
  }, [visible]);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem(LOCALSTORAGE_KEY, '1');
  };

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
