// /src/features/contact/components/ContactForm.tsx

import '../styles/ContactForm.scss';

export const ContactForm = () => {
  return (
    <form className='contact-form' autoComplete='off'>
      <h2 className='contact-form__title'>You Have Question?</h2>
      <p className='contact-form__desc'>Let´s talk, share your ideas or meet met.</p>
      <input type='text' className='contact-form__input' placeholder='Your Name' name='name' />
      <input type='email' className='contact-form__input' placeholder='Your Email' name='email' />
      <input
        type='text'
        className='contact-form__input'
        placeholder='Your Subject'
        name='subject'
      />
      <textarea
        className='contact-form__input contact-form__textarea'
        placeholder='Your Messages'
        name='message'
      />
      <button className='contact-form__button' type='submit'>
        SEND MESSAGE
      </button>
    </form>
  );
};
