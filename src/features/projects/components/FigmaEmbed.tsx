// /src/features/projects/components/FigmaEmbed.tsx
'use strict';

import React, { useMemo } from 'react';
import '../styles/FigmaEmbed.scss';

interface Props {
  embedUrl: string;
  /** Optional percentage (e.g., 62.5 = 16:10, 56.25 = 16:9) */
  ratio?: number;
}

/**
 * FigmaEmbed
 * - Renders a responsive iframe for a Figma public file embed URL.
 * - Minimal guard: only allow "https://www.figma.com/embed?..." (prevents accidental wrong URLs).
 */
const FigmaEmbed: React.FC<Props> = ({ embedUrl, ratio = 62.5 }) => {
  const safe = useMemo(() => {
    try {
      const u = new URL(embedUrl);
      const isFigma = u.hostname === 'www.figma.com' && u.pathname.startsWith('/embed');
      return isFigma ? embedUrl : '';
    } catch {
      return '';
    }
  }, [embedUrl]);

  if (!safe) {
    return (
      <div className='figmaEmbed'>
        <div className='figmaEmbed__ratio' style={{ paddingBottom: `${ratio}%` }}>
          <div className='figmaEmbed__fallback' role='alert'>
            Invalid Figma embed URL.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='figmaEmbed'>
      <div className='figmaEmbed__ratio' style={{ paddingBottom: `${ratio}%` }}>
        <iframe className='figmaEmbed__iframe' title='Figma Preview' src={safe} allowFullScreen />
      </div>
    </div>
  );
};

export default FigmaEmbed;
