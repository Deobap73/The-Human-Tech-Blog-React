// src/pages/NotAuthorizedPage.tsx
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const NotAuthorizedPage = () => {
  const { t } = useTranslation();

  return (
    <div className='not-authorized-page' style={{ textAlign: 'center', padding: '64px 0' }}>
      <h2>{t('notAuthorized.title', 'Access Denied')}</h2>
      <p>{t('notAuthorized.message', "You don't have permission to access this page.")}</p>
      <Link to='/' className='not-authorized-page__home-link'>
        {t('notAuthorized.goHome', 'Go to Home')}
      </Link>
    </div>
  );
};

export default NotAuthorizedPage;
