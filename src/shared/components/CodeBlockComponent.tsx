// src/shared/components/CodeBlockComponent.tsx

import React, { useCallback } from 'react';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import '../../features/post/styles/CodeBlockComponent.scss';

const LANGUAGES = ['typescript', 'javascript', 'html', 'css', 'json', 'scss'];

const CodeBlockComponent = ({ node, updateAttributes }: any) => {
  const language = node.attrs.language || 'typescript';

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateAttributes({ language: e.target.value });
    },
    [updateAttributes]
  );

  return (
    <NodeViewWrapper className='code-block'>
      <div className='code-block__header'>
        <select className='code-block__select' value={language} onChange={handleChange}>
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>
      <pre className='code-block__body'>
        <NodeViewContent as='code' className='code-block__content' />
      </pre>
    </NodeViewWrapper>
  );
};

export default CodeBlockComponent;
