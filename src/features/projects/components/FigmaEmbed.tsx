// /src/features/projects/components/FigmaEmbed.tsx
'use strict';

import React from 'react';
import '../styles/FigmaEmbed.scss';

/**
 * FigmaEmbed
 * - Renders a responsive iframe for a Figma public file embed URL
 * - The URL should already be the Figma "embed" form (with /embed?embed_host=share&url=...)
 */
interface Props {
  embedUrl: string;
}

const FigmaEmbed: React.FC<Props> = ({ embedUrl }) => {
  return (
    <div className='figmaEmbed'>
      <div className='figmaEmbed__ratio'>
        <iframe
          className='figmaEmbed__iframe'
          title='Figma Preview'
          src={embedUrl}
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default FigmaEmbed;
