// The-Human-Tech-Blog-React/src/components/featured/Featured.tsx

import "../styles/Featured.scss";

export const Featured = () => {
  return (
    <section className='featured'>
      <div className='featured__header'>
        <h2 className='featured__title'>Featured Post</h2>
        <p className='featured__subtitle'>Highlight of the week curated for you</p>
      </div>
      <div className='featured__card'>
        <img className='featured__image' src='/src/assets/frontPage.webp' alt='Featured' />
        <div className='featured__content'>
          <h3 className='featured__content-title'>Understanding SCRUM in Agile Teams</h3>
          <p className='featured__content-description'>
            An introduction to Scrum methodology, its ceremonies, and benefits for product delivery.
          </p>
          <button className='featured__read-more'>Read More</button>
        </div>
      </div>
    </section>
  );
};
