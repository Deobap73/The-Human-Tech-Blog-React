// The-Human-Tech-Blog-React\src\components\aboutMe\AboutMe.tsx

import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import "../styles/AboutMe.scss";

export const AboutMe = () => {
  const navigate = useNavigate();

  const goToAboutPage = async () => {
    navigate('/about');
  };
  return (
    <>
      <div className='aboutMeHome'>
        <div className='aboutMeHome__yearsExperience'>
          <h2 className='aboutMeHome__yearsExperience__number'>36</h2>
          <p className='aboutMeHome__yearsExperience__text'>Years experience Working</p>
        </div>
        <div className='aboutMeHome__slogan'>
          <h3 className='aboutMeHome__slogan__title'>About Me</h3>
          <p className='aboutMeHome__slogan__sloganText'>
            Bringing code and leadership together to drive growth.
          </p>
        </div>
        <div className='aboutMeHome__myStorie'>
          <p className='aboutMeHome__myStorie__description'>
            I'm a tech enthusiast and blogger sharing my journey through the human side of
            technology. Join me as I explore the intersection of tech and humanity.
          </p>
          <button onClick={goToAboutPage} className='aboutMeHome__myStorie__buttonAboutPage'>
            CONTINUE READING <FaArrowRight />
          </button>
        </div>
      </div>
    </>
  );
};
