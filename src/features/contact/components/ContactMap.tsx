// /src/features/contact/components/ContactMap.tsx

import '../styles/ContactMap.scss';

export const ContactMap = () => {
  return (
    <div className='contact-map'>
      <iframe
        width='100%'
        height='650'
        src='https://www.openstreetmap.org/export/embed.html?bbox=13.404736518859865%2C48.5581195404198%2C13.459925651550295%2C48.57629480168098&amp;layer=mapnik'
        style={{ border: '1px solid #111', borderRadius: '16px' }}
        loading='lazy'
        title='Contact Map'
      />
      <div className='contact-map__link'>
        <a
          href='https://www.openstreetmap.org/?#map=15/48.56721/13.43233'
          target='_blank'
          rel='noopener noreferrer'>
          Ver mapa ampliado
        </a>
      </div>
    </div>
  );
};
