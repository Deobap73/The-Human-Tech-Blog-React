// src/features/post/pages/WritePage.tsx
import { useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import api from '../../../shared/utils/axios';
import { useAuth } from '../../../features/auth/services/useAuth';

const WritePage = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [cover, setCover] = useState<File | null>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
  });

  const handleSubmit = async () => {
    if (!title || !editor || !editor.getHTML()) return;

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
      content: editor.getHTML(),
      author: user?._id,
      cover: coverUrl,
    });
  };

  return (
    <div className='write-page'>
      <h2>Create New Post</h2>
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
