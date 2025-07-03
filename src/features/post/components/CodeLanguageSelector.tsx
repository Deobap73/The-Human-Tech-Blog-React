// src/features/post/components/CodeLanguageSelector.tsx

import { Editor } from '@tiptap/react';
import '../styles/CodeLanguageSelector.scss';

interface LanguageSelectorProps {
  editor: Editor;
  pos: number;
  language: string;
}

const SUPPORTED_LANGUAGES = [
  'bash',
  'html',
  'css',
  'scss',
  'javascript', // Manter 'javascript' para realce consistente
  'typescript',
  'react',
  'python',
  'java',
  'go',
  'rust',
  'csharp', // Ou 'c#' dependendo de como sua biblioteca de realce a reconhece
  'sql',
  'json',
];

const CodeLanguageSelector = ({ editor, pos, language }: LanguageSelectorProps) => {
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
    <div className='code-language-selector'>
      <label htmlFor={`lang-${pos}`} className='language-selector__label'>
        Language:
      </label>
      <select
        id={`lang-${pos}`}
        className='code-language-selector__dropdown'
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

export default CodeLanguageSelector;
