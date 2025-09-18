// File: /src/features/ats/components/GeneratorOptions.tsx
// Description: Options for language, tone, seniority, keywords.

import React, { useCallback, useState } from 'react';
import '../styles/GeneratorOptions.scss';
import { AtsOptions } from '../../../types/Ats';

interface GeneratorOptionsProps {
  value: AtsOptions;
  onChange: (opts: AtsOptions) => void;
}

const GeneratorOptions: React.FC<GeneratorOptionsProps> = ({ value, onChange }) => {
  const [local, setLocal] = useState<AtsOptions>(value);

  const commit = useCallback(
    (patch: Partial<AtsOptions>) => {
      const next = { ...local, ...patch };
      setLocal(next);
      onChange(next);
      return;
    },
    [local, onChange]
  );

  const handleKeywords = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const list = e.target.value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      commit({ includeKeywords: list });
      return;
    },
    [commit]
  );

  return (
    <div className='gen-options'>
      <h3 className='gen-options__title'>Options</h3>

      <div className='gen-options__row'>
        <label className='gen-options__label' htmlFor='opt-language'>
          Language
        </label>
        <select
          id='opt-language'
          className='gen-options__select'
          value={local.language}
          onChange={(e) => commit({ language: e.target.value as AtsOptions['language'] })}>
          <option value='en'>English</option>
          <option value='pt'>Português (PT)</option>
          <option value='es'>Español</option>
          <option value='de'>Deutsch</option>
        </select>
      </div>

      <div className='gen-options__row'>
        <label className='gen-options__label' htmlFor='opt-tone'>
          Tone
        </label>
        <select
          id='opt-tone'
          className='gen-options__select'
          value={local.tone}
          onChange={(e) => commit({ tone: e.target.value as AtsOptions['tone'] })}>
          <option value='professional'>Professional</option>
          <option value='provocative'>Provocative</option>
          <option value='friendly'>Friendly</option>
        </select>
      </div>

      <div className='gen-options__row'>
        <label className='gen-options__label' htmlFor='opt-seniority'>
          Seniority
        </label>
        <select
          id='opt-seniority'
          className='gen-options__select'
          value={local.seniority}
          onChange={(e) => commit({ seniority: e.target.value as AtsOptions['seniority'] })}>
          <option value='junior'>Junior</option>
          <option value='mid'>Mid</option>
          <option value='senior'>Senior</option>
        </select>
      </div>

      <div className='gen-options__row'>
        <label className='gen-options__label' htmlFor='opt-keywords'>
          Keywords (comma-separated)
        </label>
        <input
          id='opt-keywords'
          className='gen-options__input'
          type='text'
          placeholder='e.g. stakeholder management, Agile, TypeScript'
          defaultValue={local.includeKeywords.join(', ')}
          onChange={handleKeywords}
        />
      </div>
    </div>
  );
};

export default GeneratorOptions;
