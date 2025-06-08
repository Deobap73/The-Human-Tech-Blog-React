// /src/features/contact/components/ContactInfo.tsx

import '../styles/ContactInfo.scss';
import { FiPhone, FiMail, FiGlobe, FiMapPin } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export const ContactInfo = () => {
  const { t } = useTranslation();

  return (
    <div className='contact-info'>
      <h6 className='contact-info__subtitle'>{t('contact.info.subtitle')}</h6>
      <h2 className='contact-info__title'>{t('contact.info.title')}</h2>
      <p className='contact-info__desc'>{t('contact.info.desc')}</p>
      <div className='contact-info__grid'>
        <div className='contact-info__item'>
          <FiPhone className='contact-info__icon' />
          <div>
            <div className='contact-info__label'>{t('contact.info.phoneLabel')}</div>
            <div className='contact-info__value'>{t('contact.info.phoneValue')}</div>
          </div>
        </div>
        <div className='contact-info__item'>
          <FiMail className='contact-info__icon' />
          <div>
            <div className='contact-info__label'>{t('contact.info.emailLabel')}</div>
            <div className='contact-info__value'>{t('contact.info.emailValue')}</div>
          </div>
        </div>
        <div className='contact-info__item'>
          <FiGlobe className='contact-info__icon' />
          <div>
            <div className='contact-info__label'>{t('contact.info.websiteLabel')}</div>
            <div className='contact-info__value'>{t('contact.info.websiteValue')}</div>
          </div>
        </div>
        <div className='contact-info__item'>
          <FiMapPin className='contact-info__icon' />
          <div>
            <div className='contact-info__label'>{t('contact.info.addressLabel')}</div>
            <div className='contact-info__value'>{t('contact.info.addressValue')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
