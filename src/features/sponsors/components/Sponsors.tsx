// src/features/sponsors/components/Sponsors.tsx

import { useEffect, useState } from 'react';
import '../styles/Sponsors.scss';

interface Sponsor {
  _id: string;
  name: string;
  logoUrl: string;
  website?: string;
}

export const Sponsors = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
    const fetchSponsors = async () => {
      try {
        const res = await fetch(`${apiBase}/sponsors`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to load sponsors');
        const data = await res.json();
        setSponsors(data);
      } catch {
        setSponsors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSponsors();
  }, []);

  if (loading) {
    return <div className='sponsors sponsors--loading'>Loading sponsors...</div>;
  }

  return (
    <section className='sponsors'>
      <div className='sponsors__list'>
        {sponsors.map((sponsor) =>
          sponsor.website ? (
            <a
              key={sponsor._id}
              href={sponsor.website}
              target='_blank'
              rel='noopener noreferrer'
              className='sponsors__item'
              tabIndex={0}>
              <img
                src={sponsor.logoUrl}
                alt={sponsor.name}
                className='sponsors__logo'
                loading='lazy'
              />
              <span className='sponsors__name'>{sponsor.name}</span>
            </a>
          ) : (
            <div key={sponsor._id} className='sponsors__item sponsors__item--no-link'>
              <img src={sponsor.logoUrl} alt={sponsor.name} className='sponsors__logo' />
              <span className='sponsors__name'>{sponsor.name}</span>
            </div>
          )
        )}
        {sponsors.length === 0 && <span className='sponsors__empty'>No sponsors registered</span>}
      </div>
    </section>
  );
};

export default Sponsors;
