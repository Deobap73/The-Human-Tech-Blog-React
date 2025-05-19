// src/features/post/pages/WritePage.tsx

'use client';

import { useEffect, useState, useCallback } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Toolbar from '../components/EditorToolbar';
import api from '../../../shared/utils/axios';
import { useAuth } from '../../../shared/hooks/useAuth';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/WritePage.scss';

const schema = z.object({
  title: z.string().min(5, 'Title is too short'),
  content: z.string().min(10, 'Content too short'),
});

const WritePage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [postId, setPostId] = useState<string | null>(id || null);

  const editor = useEditor({
    extensions: [StarterKit, Underline, Image],
    content: '',
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setTitle(res.data.title);
        editor?.commands.setContent(res.data.content);
        setStatus(res.data.status);
      } catch (err) {
        console.error(err);
        setError('Failed to load post');
      }
    };

    if (id && editor) fetchPost();
  }, [id, editor]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const autoSaveDraft = useCallback(async () => {
    if (!editor) return;
    const content = editor.getHTML();

    setSaveStatus('saving');

    const draft = {
      title,
      description: '',
      content,
      image: '',
      tags: [],
      status: 'draft',
    };

    try {
      if (postId) {
        await api.patch(`/posts/${postId}`, draft);
      } else {
        const res = await api.post('/posts', draft);
        setPostId(res.data.post._id);
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSaveStatus('idle');
    }
  }, [title, editor, postId]);

  useEffect(() => {
    if (!editor) return;

    if (timeoutId) clearTimeout(timeoutId);

    const tid = setTimeout(() => {
      const content = editor.getHTML();
      if (title.trim() || content.trim()) autoSaveDraft();
    }, 4000);

    setTimeoutId(tid);
    return () => clearTimeout(tid);
  }, [title, editor, autoSaveDraft]);

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

    const payload = {
      title,
      description: '',
      content,
      image: coverUrl,
      tags: [],
      status: 'published',
    };

    try {
      if (postId) {
        await api.patch(`/posts/${postId}`, payload);
      } else {
        const res = await api.post('/posts', payload);
        setPostId(res.data.post._id);
      }
      navigate('/admin/posts');
    } catch (error) {
      console.error('Failed to submit post:', error);
      setError('Failed to submit post');
    }
  };

  const handleSaveDraft = async () => {
    if (!editor) return;
    const content = editor.getHTML();

    const draft = {
      title,
      description: '',
      content,
      image: '',
      tags: [],
      status: 'draft',
    };

    try {
      if (postId) {
        await api.patch(`/posts/${postId}`, draft);
      } else {
        const res = await api.post('/posts', draft);
        setPostId(res.data.post._id);
      }
      setStatus('draft');
    } catch (error) {
      console.error('Failed to save draft:', error);
      setError('Failed to save draft');
    }
  };

  return (
    <div className='write-page'>
      <h2>{id ? 'Edit Post' : 'Create New Post'}</h2>
      {error && <p className='error'>{error}</p>}
      <p className='status-indicator'>
        Status: <strong>{status}</strong>
      </p>
      <p className='autosave-indicator'>
        {saveStatus === 'saving' && '💾 Saving...'}
        {saveStatus === 'saved' && '✅ Saved'}
      </p>

      {previewUrl && (
        <div className='cover-preview'>
          <img src={previewUrl} alt='Preview' className='preview-image' />
        </div>
      )}

      <input
        type='text'
        placeholder='Post title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type='file'
        accept='image/*'
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setCover(file);
          if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
          } else {
            setPreviewUrl(null);
          }
        }}
      />

      {editor && <Toolbar editor={editor} onSaveDraft={handleSaveDraft} onPublish={handleSubmit} />}
      <EditorContent editor={editor} />
    </div>
  );
};

export default WritePage;
