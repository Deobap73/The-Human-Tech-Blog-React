// ✅ Path: /src/features/post/components/EditorToolbar.tsx

import { Editor } from '@tiptap/react';
import Link from '@tiptap/extension-link';

import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading,
  List,
  ListOrdered,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Code2,
  Code,
  Link as LinkIcon,
  Unlink,
} from 'lucide-react';
import '../styles/EditorToolbar.scss';

interface EditorToolbarProps {
  editor: Editor;
  onPublish: () => void;
  onSaveDraft?: () => void;
}

const Toolbar = ({ editor, onSaveDraft, onPublish }: EditorToolbarProps) => {
  if (!editor) return null;

  return (
    <div className='toolbar'>
      {/* Formatting */}
      <button
        type='button'
        className={`editor-toolbar__btn${
          editor.isActive('bold') ? ' editor-toolbar__btn--active' : ''
        }`}
        aria-label='Bold'
        onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold size={16} />
      </button>
      <button
        type='button'
        className={`editor-toolbar__btn${
          editor.isActive('italic') ? ' editor-toolbar__btn--active' : ''
        }`}
        aria-label='Italic'
        onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic size={16} />
      </button>
      <button
        type='button'
        className={`editor-toolbar__btn${
          editor.isActive('underline') ? ' editor-toolbar__btn--active' : ''
        }`}
        aria-label='Underline'
        onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <Underline size={16} />
      </button>
      <button
        type='button'
        className={`editor-toolbar__btn${
          editor.isActive('strike') ? ' editor-toolbar__btn--active' : ''
        }`}
        aria-label='Strikethrough'
        onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough size={16} />
      </button>

      {/* Headings */}
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <button
          key={level}
          type='button'
          className={`editor-toolbar__btn${
            editor.isActive('heading', { level }) ? ' editor-toolbar__btn--active' : ''
          }`}
          aria-label={`Heading ${level}`}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}>
          H{level}
        </button>
      ))}

      {/* Lists */}
      <button
        type='button'
        className={`editor-toolbar__btn${
          editor.isActive('bulletList') ? ' editor-toolbar__btn--active' : ''
        }`}
        aria-label='Bullet List'
        onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List size={16} />
      </button>
      <button
        type='button'
        className={`editor-toolbar__btn${
          editor.isActive('orderedList') ? ' editor-toolbar__btn--active' : ''
        }`}
        aria-label='Ordered List'
        onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered size={16} />
      </button>

      {/* Alignment */}
      {['left', 'center', 'right', 'justify'].map((align) => (
        <button
          key={align}
          type='button'
          className={`editor-toolbar__btn${
            editor.isActive({ textAlign: align }) ? ' editor-toolbar__btn--active' : ''
          }`}
          aria-label={`Align ${align}`}
          onClick={() => editor.chain().focus().setTextAlign(align).run()}>
          {
            {
              left: <AlignLeft size={16} />,
              center: <AlignCenter size={16} />,
              right: <AlignRight size={16} />,
              justify: <AlignJustify size={16} />,
            }[align]
          }
        </button>
      ))}

      {/* Code block */}
      <button
        type='button'
        className={`editor-toolbar__btn${
          editor.isActive('codeBlock') ? ' editor-toolbar__btn--active' : ''
        }`}
        aria-label='Code Block'
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        <Code2 size={16} />
      </button>

      {/* Inline Code */}
      <button
        type='button'
        className={`editor-toolbar__btn${
          editor.isActive('code') ? ' editor-toolbar__btn--active' : ''
        }`}
        aria-label='Inline Code'
        onClick={() => editor.chain().focus().toggleCode().run()}>
        <Code size={16} />
      </button>

      {/* Undo / Redo */}
      <button
        type='button'
        className='editor-toolbar__btn'
        aria-label='Undo'
        onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 size={16} />
      </button>
      <button
        type='button'
        className='editor-toolbar__btn'
        aria-label='Redo'
        onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 size={16} />
      </button>

      {/* Link */}
      <button
        type='button'
        className={`editor-toolbar__btn${
          editor.isActive('link') ? ' editor-toolbar__btn--active' : ''
        }`}
        aria-label='Add/Edit Link'
        onClick={() => {
          const previousUrl = editor.getAttributes('link').href;
          const url = window.prompt('Enter URL', previousUrl || '');
          if (url === null) return;
          if (url === '') {
            editor.chain().focus().unsetLink().run();
            return;
          }
          editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }}>
        <LinkIcon size={16} />
      </button>

      {/* Remove Link */}
      <button
        type='button'
        className='editor-toolbar__btn'
        aria-label='Remove Link'
        onClick={() => editor.chain().focus().unsetLink().run()}>
        <Unlink size={16} />
      </button>

      {/* Actions */}
      <div className='toolbar'>
        {onSaveDraft && (
          <button
            type='button'
            onClick={onSaveDraft}
            className='editor-toolbar__btn editor-toolbar__action--draft'>
            Save Draft
          </button>
        )}
        <button
          type='button'
          onClick={onPublish}
          className='editor-toolbar__btn editor-toolbar__action--publish'>
          Publish
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
