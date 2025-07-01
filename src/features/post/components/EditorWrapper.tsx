// src/features/post/components/EditorWrapper.tsx

import { useEffect } from 'react';
import { EditorContent, Editor } from '@tiptap/react';
import CodeLanguageSelector from './CodeLanguageSelector';

interface EditorWrapperProps {
  editor: Editor;
}

const EditorWrapper = ({ editor }: EditorWrapperProps) => {
  useEffect(() => {
    if (!editor) return;

    const updateLanguageSelectors = () => {
      const root = document.querySelector('.ProseMirror');
      if (!root) return;

      const codeBlocks = root.querySelectorAll('pre[data-language]');

      codeBlocks.forEach((block, index) => {
        const containerId = `lang-selector-${index}`;
        let existing = block.querySelector(`#${containerId}`);

        if (!existing) {
          const wrapper = document.createElement('div');
          wrapper.id = containerId;
          wrapper.className = 'language-selector-wrapper';
          block.insertBefore(wrapper, block.firstChild);

          editor.view.dispatch(editor.view.state.tr); // Trigger re-render
        }
      });
    };

    updateLanguageSelectors();
    editor.on('update', updateLanguageSelectors);

    return () => {
      editor.off('update', updateLanguageSelectors);
    };
  }, [editor]);

  return (
    <div className='editor-wrapper'>
      <EditorContent editor={editor} />
      {/* Render LanguageSelector dynamically */}
      <div className='language-select-overlays'>
        {editor &&
          editor.state.doc.content.content
            .map((node, index) => {
              if (node.type.name === 'codeBlock') {
                const language = node.attrs.language || 'typescript';
                return (
                  <CodeLanguageSelector
                    key={index}
                    editor={editor}
                    pos={index + 1}
                    language={language}
                  />
                );
              }
              return null;
            })
            .filter(Boolean)}
      </div>
    </div>
  );
};

export default EditorWrapper;
