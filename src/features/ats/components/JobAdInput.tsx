// File: /src/features/ats/components/JobAdInput.tsx
// Description: Job ad text input area (required).

import React, { useCallback } from 'react';
import '../styles/JobAdInput.scss';

interface JobAdInputProps {
  value: string;
  onChange: (v: string) => void;
}

const JobAdInput: React.FC<JobAdInputProps> = ({ value, onChange }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
      return;
    },
    [onChange]
  );

  return (
    <div className='job-ad'>
      <div className='job-ad__header'>
        <h2 className='job-ad__title'>Job Ad</h2>
        <p className='job-ad__hint'>Paste the job description here.</p>
      </div>

      <textarea
        className='job-ad__textarea'
        value={value}
        onChange={handleChange}
        placeholder='Paste the job ad here…'
        rows={10}
      />
    </div>
  );
};

export default JobAdInput;
