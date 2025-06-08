// /src/features/contact/components/ContactInfo.tsx

import '../styles/ContactInfo.scss';
import { FiPhone, FiMail, FiGlobe, FiMapPin } from 'react-icons/fi';

export const ContactInfo = () => {
  return (
    <div className='contact-info'>
      <h6 className='contact-info__subtitle'>Contact Us</h6>
      <h2 className='contact-info__title'>Get In Touch</h2>
      <p className='contact-info__desc'>
        Curious about project management, frontend, or UI/UX? <br /> Or perhaps you’d like to
        explore reflections on life through the lens of technology? <br />
        Whatever the topic, I’d love to hear your perspective. Get in touch!
      </p>
      <div className='contact-info__grid'>
        <div className='contact-info__item'>
          <FiPhone className='contact-info__icon' />
          <div>
            <div className='contact-info__label'>Phone Number</div>
            <div className='contact-info__value'>(+49) 176 34644129</div>
          </div>
        </div>
        <div className='contact-info__item'>
          <FiMail className='contact-info__icon' />
          <div>
            <div className='contact-info__label'>Email Address</div>
            <div className='contact-info__value'>contact@thehumantechblog.com</div>
          </div>
        </div>
        <div className='contact-info__item'>
          <FiGlobe className='contact-info__icon' />
          <div>
            <div className='contact-info__label'>Websites</div>
            <div className='contact-info__value'>www.deolindobaptista.com</div>
          </div>
        </div>
        <div className='contact-info__item'>
          <FiMapPin className='contact-info__icon' />
          <div>
            <div className='contact-info__label'>Address</div>
            <div className='contact-info__value'>Passau, Germany</div>
          </div>
        </div>
      </div>
    </div>
  );
};
