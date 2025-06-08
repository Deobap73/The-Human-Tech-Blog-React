// /src/features/contact/components/ContactForm.tsx

import '../styles/ContactForm.scss';
import { useTranslation } from 'react-i18next';

export const ContactForm = () => {
  const { t } = useTranslation();

  return (
    <form className='contact-form' autoComplete='off'>
      <h2 className='contact-form__title'>{t('contact.form.title')}</h2>
      <p className='contact-form__desc'>{t('contact.form.desc')}</p>
      <input
        type='text'
        className='contact-form__input'
        placeholder={t('contact.form.placeholderName')}
        name='name'
      />
      <input
        type='email'
        className='contact-form__input'
        placeholder={t('contact.form.placeholderEmail')}
        name='email'
      />
      <input
        type='text'
        className='contact-form__input'
        placeholder={t('contact.form.placeholderSubject')}
        name='subject'
      />
      <textarea
        className='contact-form__input contact-form__textarea'
        placeholder={t('contact.form.placeholderMessage')}
        name='message'
      />
      <button className='contact-form__button' type='submit'>
        {t('contact.form.button')}
      </button>
    </form>
  );
};
