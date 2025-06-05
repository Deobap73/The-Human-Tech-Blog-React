// src/pages/about/AboutPage.tsx

import '../styles/AboutPage.scss';
import AboutMe from '../components/AboutMe';
import { AuthorIntro } from '../components/AuthorIntro';
import ExperienceTimeline from '../components/ExperienceTimeline';

const AboutPage = () => {
  return (
    <div className='aboutPage'>
      <AuthorIntro />
      <AboutMe />
      <ExperienceTimeline />
    </div>
  );
};

export default AboutPage;
