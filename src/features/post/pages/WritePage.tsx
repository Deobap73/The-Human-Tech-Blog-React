// The-Human-Tech-Blog-React/src/features/post/pages/WritePage.tsx

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
  const [postId, setPostId] = useState<string | null>(null);

  // Tiptap Editor initialization
  const editor = useEditor({
    extensions: [StarterKit, Underline, Image],
    content: '',
  });

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Universal protection: only author or admin can edit the draft or post
  useEffect(() => {
    if (!id || !user) return;

    // Tries to fetch as draft, then as post if not found
    const fetchContent = async () => {
      try {
        // 1. Try as draft
        const res = await api.get(`/drafts/${id}`);
        const fetchedDraft = res.data;

        // If current user is not the author, block access and redirect
        if (fetchedDraft.author !== user._id) {
          toast.error('You are not allowed to edit this draft.');
          navigate('/');
        } else {
          setTitle(fetchedDraft.title);
          if (editor) editor.commands.setContent(fetchedDraft.content || '');
          setDraftId(fetchedDraft._id);
          setPostId(null);
          setStatus(fetchedDraft.status || 'draft');
        }
      } catch (draftErr) {
        // 2. If not a draft, try as post
        try {
          const res = await api.get(`/posts/${id}`);
          const fetchedPost = res.data;

          // If not author or admin, block
          if (fetchedPost.author !== user._id && user.role !== 'admin') {
            toast.error('You are not allowed to edit this post.');
            navigate('/');
          } else {
            setTitle(fetchedPost.title);
            if (editor) editor.commands.setContent(fetchedPost.content || '');
            setPostId(fetchedPost._id);
            setDraftId(null);
            setStatus('published');
          }
        } catch (postErr) {
          toast.error('Draft or Post not found or inaccessible.');
          navigate('/');
        }
      }
    };

    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?._id, user?.role, editor, navigate]);

  // Auto-save draft logic
  const autoSaveDraft = useCallback(async () => {
    if (!editor || !user || !getAccessToken()) return;
    if (postId) return; // Don't auto-save if editing a post

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
        const res = await api.patch(`/drafts/${draftId}`, draft);
        setStatus(res.data.draft.status);
      } else {
        const res = await api.post('/drafts', draft);
        setDraftId(res.data.draft._id);
        setStatus(res.data.draft.status);
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      toast.success('Draft auto-saved');
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSaveStatus('idle');
      toast.error('Auto-save failed');
    }
  }, [title, editor, user, draftId, postId]);

  // Debounced auto-save effect
  useEffect(() => {
    if (!editor || !getAccessToken() || postId) return;

    if (timeoutId) clearTimeout(timeoutId);

    const tid = setTimeout(() => {
      const content = editor.getHTML();
      if (title.trim() || content.trim()) autoSaveDraft();
    }, 4000);

    setTimeoutId(tid);
    return () => clearTimeout(tid);
  }, [title, editor, autoSaveDraft, postId]);

  // Submit handler to publish post or update post
  const handleSubmit = async () => {
    if (!editor || !user) return;

    const content = editor.getHTML();
    const result = schema.safeParse({ title, content });
    if (!result.success) {
      setError(result.error.issues[0].message);
      toast.error(result.error.issues[0].message);
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
      description: editor?.getText().slice(0, 160) || '',
      content,
      image: coverUrl,
      tags: [],
      status: 'published',
      draftId,
    };

    try {
      if (postId) {
        // Update post (only for author/admin)
        await api.patch(`/posts/${postId}`, payload);
        toast.success('Post updated');
      } else {
        // Publish draft as post or create new post
        await api.post('/posts', payload);
        setStatus('published');
        if (draftId) await api.delete(`/drafts/${draftId}`);
        toast.success('Post published');
      }
      navigate('/admin/posts');
    } catch (error) {
      console.error('Failed to publish/update post:', error);
      toast.error('Failed to publish/update post');
    }
  };

  return (
    <div className='write-page'>
      <h2>
        {status === 'published'
          ? postId
            ? 'Edit Post'
            : 'Published Post'
          : draftId
          ? 'Edit Draft'
          : 'Create New Post'}
      </h2>
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

      {editor && <Toolbar editor={editor} onPublish={handleSubmit} />}
      <EditorContent editor={editor} />
    </div>
  );
};

export default WritePage;
