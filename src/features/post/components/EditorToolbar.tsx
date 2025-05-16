// src/features/post/components/EditorToolbar.tsx
import { Editor } from '@tiptap/react';
import '../styles/EditorToolbar.scss';

interface EditorToolbarProps {
  editor: Editor | null;
}

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type Attributes = { [key: string]: string | number | boolean | null | undefined };

const headingLevels: HeadingLevel[] = [1, 2, 3, 4, 5, 6];

const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  if (!editor) return null;

  const isActive = (type: string, attrs?: Attributes) =>
    editor.isActive(type, attrs) ? 'active' : '';

  return (
    <div className='editor-toolbar'>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={isActive('bold')}>
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={isActive('italic')}>
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={isActive('strike')}>
        Strike
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={isActive('paragraph')}>
        P
      </button>

      {headingLevels.map((level) => (
        <button
          key={level}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          className={isActive('heading', { level })}>
          H{level}
        </button>
      ))}

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={isActive('bulletList')}>
        • List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={isActive('orderedList')}>
        1. List
      </button>
      <button onClick={() => editor.chain().focus().undo().run()} className=''>
        Undo
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} className=''>
        Redo
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()} className=''>
        Clear
      </button>
    </div>
  );
};

export default EditorToolbar;
