// /src/features/post/components/EditorWrapper.tsx
import { useEffect } from 'react';
import { EditorContent, Editor } from '@tiptap/react';
import CodeLanguageSelector from './CodeLanguageSelector';
import '../styles/EditorWrapper.scss';

interface EditorWrapperProps {
  editor: Editor;
}

/**
 * Wrapper around EditorContent that:
 * - Keeps language selectors for code blocks
 * - Adds a responsive horizontal scroll container for wide tables
 */
const EditorWrapper = ({ editor }: EditorWrapperProps) => {
  useEffect(() => {
    if (!editor) return;

    const updateLanguageSelectors = () => {
      const root = document.querySelector('.ProseMirror');
      if (!root) return;

      const codeBlocks = root.querySelectorAll('pre[data-language]');

      codeBlocks.forEach((block, index) => {
        const containerId = `lang-selector-${index}`;
        const existing = block.querySelector<HTMLElement>(`#${containerId}`);

        if (!existing) {
          const wrapper = document.createElement('div');
          wrapper.id = containerId;
          wrapper.className = 'language-selector-wrapper';
          block.insertBefore(wrapper, block.firstChild);

          // Trigger a view update (safe no-op transaction)
          editor.view.dispatch(editor.view.state.tr);
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
      {/* The scroller ensures responsive horizontal scroll for wide tables */}
      <div className='editor-wrapper__scroller'>
        <EditorContent editor={editor} />
      </div>

      {/* Render LanguageSelector dynamically */}
      <div className='language-select-overlays'>
        {editor &&
          // Note: accessing document JSON; safe since we only render overlays for code blocks
          (editor.state.doc as any).content.content
            .map((node: any, index: number) => {
              if (node.type.name === 'codeBlock') {
                const language: string = node.attrs.language || 'typescript';
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
