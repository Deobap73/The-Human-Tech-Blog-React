// src/features/post/components/EditorToolbar.tsx
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Image,
  Heading,
  List,
  ListOrdered,
  Undo2,
  Redo2,
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor;
  onPublish: () => void;
  onSaveDraft?: () => void;
}

const Toolbar = ({ editor, onSaveDraft, onPublish }: EditorToolbarProps) => {
  if (!editor) return null;

  return (
    <div className='toolbar'>
      <button onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <Underline size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        <Heading size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered size={16} />
      </button>
      <button onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 size={16} />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 size={16} />
      </button>
      <button
        onClick={() => {
          const url = window.prompt('Image URL');
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}>
        <Image size={16} />
      </button>

      <div className='toolbar-actions'>
        {onSaveDraft && (
          <button onClick={onSaveDraft} className='draft-btn'>
            Save Draft
          </button>
        )}
        <button onClick={onPublish} className='publish-btn'>
          Publish
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
