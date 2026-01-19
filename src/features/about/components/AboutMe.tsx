// src\features\about\components\AboutMe.tsx

import '../../about/styles/AboutMe.scss';
import IdImage from '../../../assets/IdImage.webp';
import { FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { useTranslation, Trans } from 'react-i18next';

export const AboutMe = () => {
  const { t } = useTranslation();

  return (
    <section className='aboutMe'>
      <div className='aboutMe__container'>
        {/* Profile Image with decorative frame */}
        <div className='aboutMe__image-wrapper'>
          <img
            src={IdImage}
            alt={t('about.me.profileAlt')}
            className='aboutMe__image'
            loading='lazy'
          />
          <span className='aboutMe__frame aboutMe__frame--top' />
          <span className='aboutMe__frame aboutMe__frame--bottom' />
        </div>

        {/* Info content */}
        <div className='aboutMe__content'>
          <div className='aboutMe__header'>
            <h2 className='aboutMe__title'>
              {t('about.me.title')}{' '}
              <span className='aboutMe__title--accent'>{t('about.me.titleAccent')}</span>
            </h2>
          </div>
          <div className='aboutMe__intro'>
            <h3 className='aboutMe__name'>
              {t('about.me.greeting')} <span>{t('about.me.nameHighlight')}</span>
            </h3>
            <p className='aboutMe__description'>
              {t('about.me.description.1')}
              <span className='aboutMe__description--highlight'>
                {t('about.me.description.highlight')}
              </span>
              {t('about.me.description.2')}
            </p>
          </div>
          <div className='aboutMe__info-card'>
            <ul className='aboutMe__info-list'>
              <li>
                <span className='aboutMe__info-label'>{t('about.me.info.name')}:</span>
                <span className='aboutMe__info-value'>Deolindo Baptista</span>
              </li>
              {/* <li>
                <span className='aboutMe__info-label'>{t('about.me.info.phone')}:</span>
                <span className='aboutMe__info-value'>(+49) 176 34644129</span>
              </li> */}
              <li>
                <span className='aboutMe__info-label'>{t('about.me.info.email')}:</span>
                <span className='aboutMe__info-value--email'>contact@thehumantechblog.com</span>
              </li>
              <li>
                <span className='aboutMe__info-label'>{t('about.me.info.address')}:</span>
                <span className='aboutMe__info-value'>Passau, Germany</span>
              </li>
              <li className='aboutMe__info-social'>
                <span className='aboutMe__info-label'>{t('about.me.info.socialMedia')}:</span>
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
        </div>
      </div>
      <div className='aboutMe__story'>
        <p className='aboutMe__story__description'>
          <Trans i18nKey='about.me.story.body' components={{ strong: <strong />, br: <br /> }} />
        </p>
        {/*   <a
          href='https://github.com/Deobap73?tab=repositories'
          className='aboutMe__button'
          target='_blank'
          rel='noopener noreferrer'>
          {t('about.me.viewProjects')}
        </a> */}
        <a href='/projects' className='aboutMe__button' target='_blank' rel='noopener noreferrer'>
          {t('about.me.viewProjects')}
        </a>
      </div>
    </section>
  );
};

export default AboutMe;
