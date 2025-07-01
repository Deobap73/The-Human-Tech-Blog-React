// src/features/post/components/LanguageSelector.tsx

import { Editor } from '@tiptap/react';
import './LanguageSelector.scss';

interface LanguageSelectorProps {
  editor: Editor;
  pos: number;
  language: string;
}

const SUPPORTED_LANGUAGES = ['typescript', 'javascript', 'scss', 'css', 'html', 'json'];

const LanguageSelector = ({ editor, pos, language }: LanguageSelectorProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    editor
      .chain()
      .focus()
      .command(({ tr }) => {
        tr.setNodeMarkup(pos, undefined, {
          ...tr.doc.nodeAt(pos)?.attrs,
          language: lang,
        });
        return true;
      })
      .run();
  };

  return (
    <div className='language-selector'>
      <label htmlFor={`lang-${pos}`} className='language-selector__label'>
        Language:
      </label>
      <select
        id={`lang-${pos}`}
        className='language-selector__dropdown'
        value={language}
        onChange={handleChange}>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
