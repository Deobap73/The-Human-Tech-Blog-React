// src\features\about\components\AuthorIntro.tsx
import { useNavigate } from 'react-router-dom';
import '../styles/AuthorIntro.scss';

export const AuthorIntro = () => {
  const navigate = useNavigate();

  const goToAboutPage = async () => {
    navigate('/about');
  };

  return (
    <div className='AuthorIntroHome'>
      <div className='AuthorIntroHome__yearsExperience'>
        <div className='AuthorIntroHome__yearsExperience__years'>
          <h2 className='AuthorIntroHome__yearsExperience__years__number'>36</h2>
          <p className='AuthorIntroHome__yearsExperience__years__text'>Years experience Working</p>
        </div>
      </div>

      <div className='AuthorIntroHome__slogan'>
        <p className='AuthorIntroHome__slogan__text'>
          Bringing code and leadership together to drive growth.
        </p>
      </div>

      <div className='AuthorIntroHome__myStory'>
        <p className='AuthorIntroHome__myStory__description'>
          I'm a tech enthusiast and blogger sharing my journey through the human side of technology.
          Join me as I explore the intersection of tech and humanity.
        </p>
      </div>
    </div>
  );
};
