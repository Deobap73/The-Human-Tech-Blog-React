import '../../about/styles/AboutMe.scss';
import IdImage from '../../../assets/IdImage.webp';
import { FaLinkedinIn, FaGithub } from 'react-icons/fa';

export const AboutMe = () => {
  return (
    <section className='aboutMe'>
      <div className='aboutMe__container'>
        {/* Profile Image with decorative frame */}
        <div className='aboutMe__image-wrapper'>
          <img src={IdImage} alt='Profile' className='aboutMe__image' />
          <span className='aboutMe__frame aboutMe__frame--top' />
          <span className='aboutMe__frame aboutMe__frame--bottom' />
        </div>

        {/* Info content */}
        <div className='aboutMe__content'>
          <div className='aboutMe__header'>
            <h2 className='aboutMe__title'>
              About <span className='aboutMe__title--accent'>Me</span>
            </h2>
          </div>
          <div className='aboutMe__intro'>
            <h3 className='aboutMe__name'>
              Hi, my name is <span>Berto</span>
            </h3>
            <p className='aboutMe__description'>
              Aspiring Project Manager with a dev mindset. Passionate about building smart
              solutions, <span className='aboutMe__description--highlight'>leading teams,</span> and
              turning ideas into real products. Always learning, always creating.
            </p>
          </div>
          <div className='aboutMe__info-card'>
            <ul className='aboutMe__info-list'>
              <li>
                <span className='aboutMe__info-label'>Name:</span>
                <span className='aboutMe__info-value'>Deolindo Baptista</span>
              </li>
              <li>
                <span className='aboutMe__info-label'>Phone:</span>
                <span className='aboutMe__info-value'>(+49) 176 34644129</span>
              </li>
              <li>
                <span className='aboutMe__info-label'>Email:</span>
                <span className='aboutMe__info-value'>contact@thehumantechblog.com</span>
              </li>
              <li>
                <span className='aboutMe__info-label'>Address:</span>
                <span className='aboutMe__info-value'>Passau, Germany</span>
              </li>
              <li className='aboutMe__info-social'>
                <span className='aboutMe__info-label'>Social Media:</span>
                <span className='aboutMe__social-icons'>
                  <a
                    href='https://www.linkedin.com/in/deolindobaptista/'
                    className='aboutMe__social-link'
                    aria-label='LinkedIn'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <FaLinkedinIn />
                  </a>
                  <a
                    href='https://github.com/Deobap73'
                    className='aboutMe__social-link'
                    aria-label='GitHub'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <FaGithub />
                  </a>
                </span>
              </li>
            </ul>
          </div>
          <a
            href='https://github.com/Deobap73?tab=repositories'
            className='aboutMe__button'
            target='_blank'
            rel='noopener noreferrer'>
            VIEW MORE PROJECT
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
