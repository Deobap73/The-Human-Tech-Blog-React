// The-Human-Tech-Blog-React\src\components\footer\Footer.tsx

import './Footer.scss';

export const Footer = () => {
  return (
    <footer className='footer'>
      <div className='container'>
        <div className='footerContent'>
          <div className='left'>
            <div className='logo'>
              <img
                src='/src/assets/theHumanTechBlogLogo.webp'
                alt='The Human Tech Blog'
                className='logoImage'
              />
              <span className='logoText'>The Human Tech Blog</span>
            </div>
            <p className='description'>
              Exploring the human side of technology through stories, reflections, and insights from
              the tech world.
            </p>
          </div>
          <div className='right'>
            <div className='links'>
              <h4 className='title'>Quick Links</h4>
              <ul className='list'>
                <li className='item'>
                  <a href='/'>Home</a>
                </li>
                <li className='item'>
                  <a href='/about'>About</a>
                </li>
                <li className='item'>
                  <a href='/blog'>Blog</a>
                </li>
                <li className='item'>
                  <a href='/contact'>Contact</a>
                </li>
              </ul>
            </div>
            <div className='social'>
              <h4 className='title'>Follow Us</h4>
              <div className='icons'>
                <a href='#' className='icon'>
                  Twitter
                </a>
                <a href='#' className='icon'>
                  LinkedIn
                </a>
                <a href='#' className='icon'>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className='copyright'>
          © {new Date().getFullYear()} The Human Tech Blog. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
