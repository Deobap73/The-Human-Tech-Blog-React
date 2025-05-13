// The-Human-Tech-Blog-React/src/components/footer/Footer.tsx

import './styles/Footer.scss';
import logo from '../../assets/theHumanTechBlogLogo.webp';

export const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footer__container'>
        <div className='footer__content'>
          <div className='footer__left'>
            <div className='footer__logo'>
              <img src={logo} alt='The Human Tech Blog' className='footer__logo-image' />
              <span className='footer__logo-text'>The Human Tech Blog</span>
            </div>
            <p className='footer__description'>
              Exploring the human side of technology through stories, reflections, and insights from
              the tech world.
            </p>
          </div>
          <div className='footer__right'>
            <div className='footer__links'>
              <h4 className='footer__title'>Quick Links</h4>
              <ul className='footer__list'>
                <li className='footer__item'>
                  <a href='/'>Home</a>
                </li>
                <li className='footer__item'>
                  <a href='/about'>About</a>
                </li>
                <li className='footer__item'>
                  <a href='/blog'>Blog</a>
                </li>
                <li className='footer__item'>
                  <a href='/contact'>Contact</a>
                </li>
              </ul>
            </div>
            <div className='footer__social'>
              <h4 className='footer__title'>Follow Us</h4>
              <div className='footer__icons'>
                <a href='#' className='footer__icon'>
                  Twitter
                </a>
                <a href='#' className='footer__icon'>
                  LinkedIn
                </a>
                <a href='#' className='footer__icon'>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className='footer__copyright'>
          © {new Date().getFullYear()} The Human Tech Blog. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
