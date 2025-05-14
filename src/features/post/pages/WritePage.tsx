// src/features/post/pages/WritePage.tsx
import { useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import api from '../../../shared/utils/axios';
import { useAuth } from '../../../features/auth/services/useAuth';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(5, 'Title is too short'),
  content: z.string().min(10, 'Content too short'),
});

const WritePage = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [error, setError] = useState('');

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
  });

  const handleSubmit = async () => {
    if (!editor) return;

    const content = editor.getHTML();
    const result = schema.safeParse({ title, content });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    let coverUrl = '';
    if (cover) {
      const formData = new FormData();
      formData.append('file', cover);
      formData.append('upload_preset', 'your_preset');
      const res = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      coverUrl = data.secure_url;
    }

    await api.post('/api/posts', {
      title,
      content,
      author: user?._id,
      cover: coverUrl,
    });
  };

  return (
    <div className='write-page'>
      <h2>Create New Post</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type='text'
        placeholder='Post title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input type='file' accept='image/*' onChange={(e) => setCover(e.target.files?.[0] || null)} />
      <EditorContent editor={editor} />
      <button onClick={handleSubmit}>Publish</button>
    </div>
  );
};

export default WritePage;
