// src/features/post/components/EditorToolbar.tsx

import { Editor } from '@tiptap/react';
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
} from 'lucide-react';
import '../styles/EditorToolbar.scss';

/**
 * Props for the EditorToolbar component.
 */
interface EditorToolbarProps {
  editor: Editor;
  onPublish: () => void;
  onSaveDraft?: () => void;
}

/**
 * EditorToolbar component - A rich text toolbar for TipTap editors.
 * Includes formatting, heading, list, alignment, undo/redo, publish/save actions.
 */
const Toolbar = ({ editor, onSaveDraft, onPublish }: EditorToolbarProps) => {
  if (!editor) return null;

  return (
    <div className='toolbar'>
      {/* Formatting group */}
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

      {/* Heading group */}
      <button
        type='button'
        className={`editor-toolbar__btn${
          editor.isActive('heading', { level: 1 }) ? ' editor-toolbar__btn--active' : ''
        }`}
        aria-label='Heading 1'
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        H1
      </button>
      <button
        type='button'
        className={`editor-toolbar__btn${
          editor.isActive('heading', { level: 2 }) ? ' editor-toolbar__btn--active' : ''
        }`}
        aria-label='Heading 2'
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H2
      </button>
      <button
        type='button'
        className={`editor-toolbar__btn${
          editor.isActive('heading', { level: 3 }) ? ' editor-toolbar__btn--active' : ''
        }`}
        aria-label='Heading 3'
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        H3
      </button>
      <button
        type='button'
        className={`editor-toolbar__btn${
          editor.isActive('heading', { level: 4 }) ? ' editor-toolbar__btn--active' : ''
        }`}
        aria-label='Heading 4'
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}>
        H4
      </button>
      <button
        type='button'
        className={`editor-toolbar__btn${
          editor.isActive('heading', { level: 5 }) ? ' editor-toolbar__btn--active' : ''
        }`}
        aria-label='Heading 5'
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}>
        H5
      </button>

      {/* List group */}
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

      {/* Alignment group */}
      <button
        type='button'
        className={`editor-toolbar__btn${
          editor.isActive({ textAlign: 'left' }) ? ' editor-toolbar__btn--active' : ''
        }`}
        aria-label='Align Left'
        onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        <AlignLeft size={16} />
      </button>
      <button
        type='button'
        className={`editor-toolbar__btn${
          editor.isActive({ textAlign: 'center' }) ? ' editor-toolbar__btn--active' : ''
        }`}
        aria-label='Align Center'
        onClick={() => editor.chain().focus().setTextAlign('center').run()}>
        <AlignCenter size={16} />
      </button>
      <button
        type='button'
        className={`editor-toolbar__btn${
          editor.isActive({ textAlign: 'right' }) ? ' editor-toolbar__btn--active' : ''
        }`}
        aria-label='Align Right'
        onClick={() => editor.chain().focus().setTextAlign('right').run()}>
        <AlignRight size={16} />
      </button>
      <button
        type='button'
        className={`editor-toolbar__btn${
          editor.isActive({ textAlign: 'justify' }) ? ' editor-toolbar__btn--active' : ''
        }`}
        aria-label='Align Justify'
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
        <AlignJustify size={16} />
      </button>

      {/* Undo/Redo group */}
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

      {/* Actions group */}
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
