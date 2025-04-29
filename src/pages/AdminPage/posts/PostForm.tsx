// The-Human-Tech-Blog-React/src/pages/AdminPage/posts/PostForm.tsx
import { useEffect, useState } from 'react';
import api from '../../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { Category } from '../../../types/index';
// import tiptap editor
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './PostForm.scss';

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [image, setImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/categories').then((res) => setAvailableCategories(res.data));
  }, []);

  const handleImageUpload = async () => {
    if (!image) return null;
    const formData = new FormData();
    formData.append('image', image);

    const res = await api.post('/posts/upload', formData);
    return res.data.imageUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const imageUrl = await handleImageUpload();

      const payload = {
        title,
        description,
        content,
        status,
        image: imageUrl,
        categories,
      };

      await api.post('/posts', payload);
      navigate('/admin/posts');
    } catch (err) {
      console.error('Create failed', err);
    }
  };

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  return (
    <div className='post-form'>
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type='text'
          placeholder='Short description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <EditorContent editor={editor} className='editor' />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value='draft'>Draft</option>
          <option value='published'>Published</option>
        </select>

        <input
          type='file'
          accept='image/*'
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />

        <select
          multiple
          value={categories}
          onChange={(e) => setCategories(Array.from(e.target.selectedOptions, (opt) => opt.value))}>
          {availableCategories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button type='submit'>Publish</button>
      </form>
    </div>
  );
};

export default PostForm;
