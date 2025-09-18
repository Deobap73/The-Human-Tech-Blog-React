// File: /src/features/ats/components/ResultPreview.tsx
// Description: Shows generated cover letter with optional watermark before payment.

import React from 'react';
import '../styles/ResultPreview.scss';

interface ResultPreviewProps {
  content: string;
  watermark?: boolean;
}

const ResultPreview: React.FC<ResultPreviewProps> = ({ content, watermark = false }) => {
  return (
    <div className={`result-preview${watermark ? ' result-preview--watermark' : ''}`}>
      <h3 className='result-preview__title'>Preview</h3>
      <div className='result-preview__content'>
        {content ? content.split('\n').map((p, i) => <p key={i}>{p}</p>) : <p>No content yet.</p>}
      </div>
    </div>
  );
};

export default ResultPreview;
