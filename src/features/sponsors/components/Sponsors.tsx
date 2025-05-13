// The-Human-Tech-Blog-React\src\components\sponsors\Sponsors.tsx

import "../styles/Sponsors.scss";

export const Sponsors = () => {
  const sponsors = [
    { name: 'TechCorp', logo: '/src/assets/teckTools.webp' },
    { name: 'DevSolutions', logo: '/src/assets/frontEndUx.webp' },
    { name: 'CodeHub', logo: '/src/assets/agileProjects.webp' },
  ];

  return (
    <div className='sponsors'>
      <h3 className='title'>Sponsors</h3>
      <div className='sponsorsList'>
        {sponsors.map((sponsor, index) => (
          <div key={index} className='sponsorItem'>
            <img src={sponsor.logo} alt={sponsor.name} className='sponsorLogo' />
            <span className='sponsorName'>{sponsor.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
