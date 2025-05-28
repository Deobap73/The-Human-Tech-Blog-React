// The-Human-Tech-Blog-React\src\components\sponsors\Sponsors.tsx

import { useEffect, useState } from 'react';
import '../styles/Sponsors.scss';

// Definição do tipo para Sponsor
interface Sponsor {
  _id: string;
  name: string;
  logoUrl: string;
  website?: string;
}

// Componente Sponsors — renderiza sponsors vindos do backend
export const Sponsors = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('[Sponsors] Component initialized. Loading state:', loading); // Added debug log

  useEffect(() => {
    console.log('[Sponsors] useEffect triggered. Starting to fetch sponsors.'); // Added debug log
    // Busca sponsors do backend
    const fetchSponsors = async () => {
      try {
        console.log('[Sponsors] Attempting to fetch from /api/sponsors.'); // Added debug log
        const res = await fetch('/api/sponsors');
        console.log('[Sponsors] Fetch response received:', res.status, res.statusText); // Added debug log
        if (!res.ok) {
          console.error('[Sponsors] Failed to load sponsors. Response not OK:', res.status); // Added debug log
          throw new Error('Failed to load sponsors');
        }
        const data = await res.json();
        console.log('[Sponsors] Sponsors data successfully fetched:', data); // Added debug log
        setSponsors(data);
      } catch (err) {
        console.error('[Sponsors] Error fetching sponsors:', err); // Added debug log
        setSponsors([]); // Vazio em erro
      } finally {
        setLoading(false);
        console.log('[Sponsors] Sponsor fetch process finished. Loading state set to false.'); // Added debug log
      }
    };
    fetchSponsors();
  }, []);

  if (loading) {
    console.log('[Sponsors] Rendering loading state.'); // Added debug log
    return <div className='sponsors sponsors--loading'>Loading sponsors...</div>;
  }

  console.log('[Sponsors] Rendering sponsors. Number of sponsors:', sponsors.length); // Added debug log

  // New debug log for empty sponsors, placed outside JSX directly in the component's render logic
  if (sponsors.length === 0) {
    console.log('[Sponsors] No sponsors found, displaying empty message.');
  }

  return (
    <div className='sponsors'>
      <h3 className='title'>Sponsors</h3>
      <div className='sponsorsList'>
        {sponsors.map((sponsor) => {
          console.log(`[Sponsors] Rendering sponsor: ${sponsor.name} (ID: ${sponsor._id})`); // Added debug log for each sponsor
          return (
            <div key={sponsor._id} className='sponsorItem'>
              <a href={sponsor.website} target='_blank' rel='noopener noreferrer'>
                <img src={sponsor.logoUrl} alt={sponsor.name} className='sponsorLogo' />
              </a>
              <span className='sponsorName'>{sponsor.name}</span>
            </div>
          );
        })}
        {sponsors.length === 0 && <span className='sponsors--empty'>No sponsors registered</span>}
        {/* The problematic line is removed from here */}
      </div>
    </div>
  );
};

export default Sponsors;
