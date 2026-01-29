// ./src/features/admin/pages/AdminPostsPage.tsx
'use strict';

import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Post } from '../../../shared/types/Post';
import AdminPostForm from '../components/AdminPostForm';
import '../../admin/styles/AdminPostsPage.scss';

import { createPost, updatePost, deletePost } from '../../../shared/services/postService';

const AdminPostsPage = () => {
  const { i18n } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const loadPosts = async (): Promise<void> => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/posts`,
        { credentials: 'include' },
      );

      if (!res.ok) {
        setError('Failed to load posts');
        return;
      }

      const data = (await res.json()) as Post[];
      setPosts(data);
    } catch {
      setError('Failed to load posts');
    }
  };

  useEffect(() => {
    void loadPosts();
  }, []);

  const handleCreate = async (data: Partial<Post>): Promise<void> => {
    try {
      setError('');

      const payload = data as unknown as Parameters<typeof createPost>[0];
      await createPost(payload);

      await loadPosts();
      setCreating(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to create post');
    }
  };

  const handleEdit = async (data: Partial<Post>): Promise<void> => {
    if (!editing) return;

    try {
      setError('');

      const payload = data as unknown as Parameters<typeof updatePost>[1];
      await updatePost(editing._id, payload);

      await loadPosts();
      setEditing(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to update post');
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      setError('');
      await deletePost(id);
      await loadPosts();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to delete post');
    }
  };

  return (
    <>
      <Helmet>
        <meta name='robots' content='noindex, nofollow' />
      </Helmet>

      <div className='admin-posts-page'>
        <h2>Manage Posts</h2>

        {error && <div className='admin-posts-page__error'>{error}</div>}

        {!creating && !editing && (
          <button className='admin-posts-page__create' onClick={() => setCreating(true)}>
            Create New Post
          </button>
        )}

        {creating && (
          <div className='admin-posts-page__form-wrapper'>
            <AdminPostForm onSubmit={handleCreate} />
            <button className='admin-posts-page__cancel' onClick={() => setCreating(false)}>
              Cancel
            </button>
          </div>
        )}

        {editing && (
          <div className='admin-posts-page__form-wrapper'>
            <AdminPostForm initialPost={editing} onSubmit={handleEdit} />
            <button className='admin-posts-page__cancel' onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        )}

        <ul className='admin-posts-page__list'>
          {posts.map((post) => {
            const tr =
              post.translations[i18n.language] ||
              post.translations[i18n.language.split('-')[0]] ||
              post.translations.en;

            return (
              <li key={post._id} className='admin-posts-page__item'>
                <div className='admin-posts-page__meta'>
                  <b>{tr?.title || '[untitled]'}</b>
                  <span className='admin-posts-page__status' data-status={post.status}>
                    {post.status}
                  </span>
                  <span className='admin-posts-page__date'>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className='admin-posts-page__actions'>
                  <button className='admin-posts-page__edit' onClick={() => setEditing(post)}>
                    Edit
                  </button>
                  <button
                    className='admin-posts-page__delete'
                    onClick={() => void handleDelete(post._id)}>
                    Delete
                  </button>
                </div>
              </li>
            );
          })}

          {posts.length === 0 && <li>No posts found.</li>}
        </ul>
      </div>
    </>
  );
};

export default AdminPostsPage;
