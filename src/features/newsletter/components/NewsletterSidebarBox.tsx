// src/features/newsletter/components/NewsletterSidebarBox.tsx

import { useTranslation } from 'react-i18next';
import NewsletterForm from './NewsletterForm';
import '../styles/NewsletterSidebarBox.scss';

/**
 * NewsletterSidebarBox
 * Sidebar component for newsletter sign up.
 * Designed for persistent visibility and high conversion.
 */
const NewsletterSidebarBox = () => {
  const { t } = useTranslation();

  return (
    <aside
      className='newsletter-sidebar-box'
      aria-label={t('newsletter.sidebar.ariaLabel', 'Subscribe to newsletter')}>
      <div className='newsletter-sidebar-box__title'>
        {t('newsletter.sidebar.title', 'Never miss a story!')}
      </div>
      <div className='newsletter-sidebar-box__desc'>
        {t(
          'newsletter.sidebar.description',
          'Get our best tech reflections and news — no spam, just value.'
        )}
      </div>
      <NewsletterForm />
    </aside>
  );
};

export default NewsletterSidebarBox;
