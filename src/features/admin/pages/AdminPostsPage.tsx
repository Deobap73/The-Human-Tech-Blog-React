// src/features/admin/pages/AdminPostsPage.tsx

import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../../shared/utils/axios';
import { Post } from '../../../shared/types/Post';
import AdminPostForm from '../components/AdminPostForm';
import '../../admin/styles/AdminPostsPage.scss';

const AdminPostsPage = () => {
  const { i18n } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Load all posts
  const loadPosts = async () => {
    try {
      const res = await api.get<Post[]>('/posts');
      setPosts(res.data);
    } catch (err) {
      setError('Failed to load posts');
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // Create Post
  const handleCreate = async (data: Partial<Post>) => {
    try {
      await api.post('/posts', data);
      await loadPosts();
      setCreating(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create post');
    }
  };

  // Edit Post
  const handleEdit = async (data: Partial<Post>) => {
    if (!editing) return;
    try {
      await api.patch(`/posts/${editing._id}`, data);
      await loadPosts();
      setEditing(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update post');
    }
  };

  // Delete Post
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      await loadPosts();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete post');
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

        {/* Formulário de Criação */}
        {creating && (
          <div className='admin-posts-page__form-wrapper'>
            <AdminPostForm onSubmit={handleCreate} />
            <button className='admin-posts-page__cancel' onClick={() => setCreating(false)}>
              Cancel
            </button>
          </div>
        )}

        {/* Formulário de Edição */}
        {editing && (
          <div className='admin-posts-page__form-wrapper'>
            <AdminPostForm initialPost={editing} onSubmit={handleEdit} />
            <button className='admin-posts-page__cancel' onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        )}

        {/* Lista de Posts */}
        <ul className='admin-posts-page__list'>
          {posts.map((post) => {
            // Mostra o título no idioma corrente (ou fallback)
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
                    onClick={() => handleDelete(post._id)}>
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
