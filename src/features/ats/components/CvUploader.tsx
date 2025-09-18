// File: /src/features/ats/components/CvUploader.tsx
// Description: CV uploader supporting paste and file upload (txt/pdf/docx -> text extraction TODO).

import React, { ChangeEvent, useCallback } from 'react';
import '../styles/CvUploader.scss';

interface CvUploaderProps {
  value: string;
  onChange: (v: string) => void;
}

const CvUploader: React.FC<CvUploaderProps> = ({ value, onChange }) => {
  const handleTextArea = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
      return;
    },
    [onChange]
  );

  const handleFile = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      try {
        const file = e.target.files?.[0];
        if (!file) return;

        // Simple TXT reader. Add PDF/DOCX extraction later if required.
        if (file.type === 'text/plain') {
          const text = await file.text();
          onChange(text);
          return;
        }

        // Fallback: warn unsupported type for now
        alert(
          'For now, please paste text or upload a .txt file. PDF/DOCX parsing can be added later.'
        );
      } catch (err) {
        console.error('CV upload error:', err);
        alert('Could not read the file. Please try again.');
      }
      return;
    },
    [onChange]
  );

  return (
    <div className='cv-uploader'>
      <div className='cv-uploader__header'>
        <h2 className='cv-uploader__title'>Your CV</h2>
        <p className='cv-uploader__hint'>Paste your CV text or upload a .txt file.</p>
      </div>

      <textarea
        className='cv-uploader__textarea'
        value={value}
        onChange={handleTextArea}
        placeholder='Paste your CV text here…'
        rows={10}
      />

      <div className='cv-uploader__controls'>
        <label className='cv-uploader__upload'>
          <input type='file' accept='.txt' onChange={handleFile} />
          <span className='cv-uploader__upload-label'>Upload .txt</span>
        </label>
      </div>
    </div>
  );
};

export default CvUploader;
