// src/features/about/components/ExperienceTimeline.tsx

import '../styles/ExperienceTimeline.scss';
import ExperienceSVG from './ExperienceSVG';
import { useTranslation } from 'react-i18next';

interface Experience {
  title: string;
  date: string;
  description: string;
}

export const ExperienceTimeline = () => {
  const { t } = useTranslation();

  const experiences: Experience[] = [
    {
      title: t('about.experience.1.title'),
      date: t('about.experience.1.date'),
      description: t('about.experience.1.description'),
    },
    {
      title: t('about.experience.2.title'),
      date: t('about.experience.2.date'),
      description: t('about.experience.2.description'),
    },
    {
      title: t('about.experience.3.title'),
      date: t('about.experience.3.date'),
      description: t('about.experience.3.description'),
    },
    {
      title: t('about.experience.4.title'),
      date: t('about.experience.4.date'),
      description: t('about.experience.4.description'),
    },
  ];

  return (
    <section className='experience'>
      <h2 className='experience__title'>
        <span className='experience__title--base'>{t('about.experience.titleBase', 'My')}</span>
        <span className='experience__title--highlight'>
          {' '}
          {t('about.experience.titleHighlight', 'Experience')}
        </span>
        <span className='experience__title-underline' />
      </h2>
      <div className='experience__timeline'>
        <ExperienceSVG />
        <div className='experience__row'>
          <div className='experience__col'>
            <div className='experience__card experience__card--left card-1'>
              <h3 className='experience__card-title'>{experiences[0].title}</h3>
              <div className='experience__card-date'>{experiences[0].date}</div>
              <p className='experience__card-description'>{experiences[0].description}</p>
            </div>
            <div className='experience__card experience__card--left card-2'>
              <h3 className='experience__card-title'>{experiences[2].title}</h3>
              <div className='experience__card-date'>{experiences[2].date}</div>
              <p className='experience__card-description'>{experiences[2].description}</p>
            </div>
          </div>
          <div className='experience__col experience__col--right'>
            <div className='experience__card experience__card--right card-3'>
              <h3 className='experience__card-title'>{experiences[1].title}</h3>
              <div className='experience__card-date'>{experiences[1].date}</div>
              <p className='experience__card-description'>{experiences[1].description}</p>
            </div>
            <div className='experience__card experience__card--right card-4'>
              <h3 className='experience__card-title'>{experiences[3].title}</h3>
              <div className='experience__card-date'>{experiences[3].date}</div>
              <p className='experience__card-description'>{experiences[3].description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceTimeline;
