// src\features\about\components\AuthorIntro.tsx
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/AuthorIntro.scss';

export const AuthorIntro = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const goToAboutPage = () => {
    navigate('/about');
  };

  return (
    <div className='AuthorIntroHome'>
      <div className='AuthorIntroHome__yearsExperience'>
        <div className='AuthorIntroHome__yearsExperience__years'>
          <h2 className='AuthorIntroHome__yearsExperience__years__number'>
            {t('about.intro.years')}
          </h2>
          <p className='AuthorIntroHome__yearsExperience__years__text'>
            {t('about.intro.yearsText')}
          </p>
        </div>
      </div>

      <div className='AuthorIntroHome__slogan'>
        <p className='AuthorIntroHome__slogan__text'>{t('about.intro.slogan')}</p>
      </div>

      <div className='AuthorIntroHome__myStory'>
        <p className='AuthorIntroHome__myStory__description'>{t('about.intro.myStory')}</p>
      </div>
    </div>
  );
};
