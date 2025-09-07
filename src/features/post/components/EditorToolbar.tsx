// Path: /src/features/post/components/EditorToolbar.tsx
import { useState } from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
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
  Table as TableIcon,
  Rows,
  Columns,
  Trash2,
  Split,
  Merge,
  PlusSquare,
} from 'lucide-react';
import InsertTableModal from './InsertTableModal';
import ColorPicker from './ColorPicker';
import '../styles/EditorToolbar.scss';

interface EditorToolbarProps {
  editor: Editor;
  onPublish: () => void;
  onSaveDraft?: () => void;
}

/**
 * Editor toolbar with formatting, color, and table actions.
 * All actions are wrapped in chain().focus() to ensure correct editor state handling.
 */
const Toolbar = ({ editor, onSaveDraft, onPublish }: EditorToolbarProps) => {
  const [isTableModalOpen, setIsTableModalOpen] = useState<boolean>(false);

  if (!editor) return null;

  const openLinkDialog = (): void => {
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Enter URL', previousUrl || '');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className='toolbar'>
      {/* --- INLINE FORMATTING ------------------------------------------- */}
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
        <UnderlineIcon size={16} />
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

      {/* --- COLOR PICKER (uniform button) ------------------------------- */}
      <ColorPicker editor={editor} />

      {/* --- HEADINGS (H1..H6 textual buttons) --------------------------- */}
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

      {/* --- LISTS -------------------------------------------------------- */}
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

      {/* --- ALIGNMENT ---------------------------------------------------- */}
      {(['left', 'center', 'right', 'justify'] as const).map((align) => (
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

      {/* --- CODE --------------------------------------------------------- */}
      <button
        type='button'
        className={`editor-toolbar__btn${
          editor.isActive('codeBlock') ? ' editor-toolbar__btn--active' : ''
        }`}
        aria-label='Code Block'
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        <Code2 size={16} />
      </button>

      <button
        type='button'
        className={`editor-toolbar__btn${
          editor.isActive('code') ? ' editor-toolbar__btn--active' : ''
        }`}
        aria-label='Inline Code'
        onClick={() => editor.chain().focus().toggleCode().run()}>
        <Code size={16} />
      </button>

      {/* --- UNDO / REDO -------------------------------------------------- */}
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

      {/* --- LINKS -------------------------------------------------------- */}
      <button
        type='button'
        className={`editor-toolbar__btn${
          editor.isActive('link') ? ' editor-toolbar__btn--active' : ''
        }`}
        aria-label='Add/Edit Link'
        onClick={openLinkDialog}>
        <LinkIcon size={16} />
      </button>
      <button
        type='button'
        className='editor-toolbar__btn'
        aria-label='Remove Link'
        onClick={() => editor.chain().focus().unsetLink().run()}>
        <Unlink size={16} />
      </button>

      {/* --- TABLE GROUP -------------------------------------------------- */}
      <div className='editor-toolbar__group editor-toolbar__group--table'>
        {/* Insert Table (opens modal) */}
        <button
          type='button'
          className='editor-toolbar__btn'
          aria-label='Insert Table'
          onClick={() => setIsTableModalOpen(true)}>
          <TableIcon size={16} />
        </button>

        {/* Quick Insert 3x3 with header */}
        <button
          type='button'
          className='editor-toolbar__btn'
          aria-label='Quick Insert 3x3'
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
          title='Insert 3x3 with header'>
          <PlusSquare size={16} />
        </button>

        {/* Row ops */}
        <button
          type='button'
          className='editor-toolbar__btn'
          aria-label='Add Row Above'
          onClick={() => editor.chain().focus().addRowBefore().run()}
          title='Add row above'>
          <Rows size={16} />
        </button>
        <button
          type='button'
          className='editor-toolbar__btn'
          aria-label='Add Row Below'
          onClick={() => editor.chain().focus().addRowAfter().run()}
          title='Add row below'>
          <Rows size={16} />
        </button>
        <button
          type='button'
          className='editor-toolbar__btn'
          aria-label='Delete Row'
          onClick={() => editor.chain().focus().deleteRow().run()}
          title='Delete row'>
          <Trash2 size={16} />
        </button>

        {/* Column ops */}
        <button
          type='button'
          className='editor-toolbar__btn'
          aria-label='Add Column Left'
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          title='Add column left'>
          <Columns size={16} />
        </button>
        <button
          type='button'
          className='editor-toolbar__btn'
          aria-label='Add Column Right'
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          title='Add column right'>
          <Columns size={16} />
        </button>
        <button
          type='button'
          className='editor-toolbar__btn'
          aria-label='Delete Column'
          onClick={() => editor.chain().focus().deleteColumn().run()}
          title='Delete column'>
          <Trash2 size={16} />
        </button>

        {/* Cell ops */}
        <button
          type='button'
          className='editor-toolbar__btn'
          aria-label='Merge Cells'
          onClick={() => editor.chain().focus().mergeCells().run()}
          title='Merge cells'>
          <Merge size={16} />
        </button>
        <button
          type='button'
          className='editor-toolbar__btn'
          aria-label='Split Cell'
          onClick={() => editor.chain().focus().splitCell().run()}
          title='Split cell'>
          <Split size={16} />
        </button>

        {/* Delete table */}
        <button
          type='button'
          className='editor-toolbar__btn'
          aria-label='Delete Table'
          onClick={() => editor.chain().focus().deleteTable().run()}
          title='Delete table'>
          <Trash2 size={16} />
        </button>
      </div>

      {/* --- ACTIONS ------------------------------------------------------ */}
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

      {/* Insert Table Modal */}
      {isTableModalOpen && (
        <InsertTableModal
          onCancel={() => setIsTableModalOpen(false)}
          onInsert={(rows, cols, withHeader) => {
            editor.chain().focus().insertTable({ rows, cols, withHeaderRow: withHeader }).run();
            setIsTableModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Toolbar;
