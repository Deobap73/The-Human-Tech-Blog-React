// src/pages/contact/ContactPage.tsx

import '../styles/ContactPage.scss';
import { ContactInfo } from '../components/ContactInfo';
import { ContactForm } from '../components/ContactForm';
import { ContactMap } from '../components/ContactMap';

const ContactPage = () => {
  return (
    <main className='contact-page'>
      <section className='contact-page__top'>
        <div className='contact-page__info'>
          <ContactInfo />
        </div>
        <div className='contact-page__form'>
          <ContactForm />
        </div>
      </section>
      <section className='contact-page__map'>
        <ContactMap />
      </section>
    </main>
  );
};

export default ContactPage;
