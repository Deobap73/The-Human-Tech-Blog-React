// src/pages/about/AboutPage.tsx

import '../styles/AboutPage.scss';
import AboutMe from '../components/AboutMe';
import { AuthorIntro } from '../components/AuthorIntro';

const AboutPage = () => {
  return (
    <div className='aboutPage'>
      <section className='aboutPage__section'>
        <AuthorIntro />
      </section>
      <section className='aboutPage__section'>
        <AboutMe />
      </section>
    </div>
  );
};

export default AboutPage;
