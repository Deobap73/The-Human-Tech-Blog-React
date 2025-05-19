// ✅ src/features/post/pages/WritePage.tsx

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
import { getAccessToken } from '../../../shared/utils/authTokenStorage';
import { toast } from 'react-hot-toast';

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
  const [draftId, setDraftId] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [StarterKit, Underline, Image],
    content: '',
  });

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const autoSaveDraft = useCallback(async () => {
    if (!editor || !user || !getAccessToken()) return;

    const content = editor.getHTML();
    setSaveStatus('saving');

    const draft = {
      title,
      description: editor?.getText().slice(0, 160) || '',
      content,
      image: '',
      tags: [],
    };

    try {
      if (draftId) {
        await api.patch(`/drafts/${draftId}`, draft);
      } else {
        const res = await api.post('/drafts', draft);
        setDraftId(res.data.draft._id);
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      toast.success('💾 Draft auto-saved');
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSaveStatus('idle');
      toast.error('❌ Auto-save failed');
    }
  }, [title, editor, user, draftId]);

  useEffect(() => {
    if (!editor || !getAccessToken()) return;

    if (timeoutId) clearTimeout(timeoutId);

    const tid = setTimeout(() => {
      const content = editor.getHTML();
      if (title.trim() || content.trim()) autoSaveDraft();
    }, 4000);

    setTimeoutId(tid);
    return () => clearTimeout(tid);
  }, [title, editor, autoSaveDraft]);

  const handleSubmit = async () => {
    if (!editor || !user) return;

    const content = editor.getHTML();
    const result = schema.safeParse({ title, content });
    if (!result.success) {
      const msg = result.error.issues[0].message;
      setError(msg);
      toast.error(`⚠️ ${msg}`);
      return;
    }

    let coverUrl = '';
    if (cover) {
      const formData = new FormData();
      formData.append('file', cover);
      formData.append('upload_preset', 'your_preset');

      try {
        const res = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        coverUrl = data.secure_url;
        toast.success('🖼️ Image uploaded');
      } catch (error) {
        console.error('Upload failed:', error);
        toast.error('❌ Image upload failed');
        return;
      }
    }

    const payload = {
      title,
      description: editor?.getText().slice(0, 160) || '',
      content,
      image: coverUrl,
      tags: [],
      status: 'published',
    };

    try {
      await api.post('/posts', payload);
      if (draftId) await api.delete(`/drafts/${draftId}`);
      toast.success('✅ Post published');
      navigate('/admin/posts');
    } catch (error) {
      console.error('Failed to publish post:', error);
      toast.error('❌ Failed to publish post');
    }
  };

  return (
    <div className='write-page'>
      <h2>{draftId ? 'Edit Draft' : 'Create New Post'}</h2>
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

      {editor && <Toolbar editor={editor} onSaveDraft={autoSaveDraft} onPublish={handleSubmit} />}
      <EditorContent editor={editor} />
    </div>
  );
};

export default WritePage;
