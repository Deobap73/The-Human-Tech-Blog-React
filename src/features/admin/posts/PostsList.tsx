// The-Human-Tech-Blog-React/src/features/admin/pages/PostsList.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../shared/utils/axios';
import { Post } from '../../../shared/types/Post';
import '../styles/PostsList.scss';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';

const PostsList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = (id: string) => {
    setPostToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    try {
      await api.delete(`/posts/${postToDelete}`);
      setPosts(posts.filter((post) => post._id !== postToDelete));
    } catch (err) {
      console.error('Failed to delete post', err);
    } finally {
      setPostToDelete(null);
      setShowConfirm(false);
    }
  };

  return (
    <div className='posts-list'>
      <h2>Posts</h2>
      <button onClick={() => navigate('/admin/posts/create')}>➕ Create Post</button>
      <ul>
        {posts.map((post) => (
          <li key={post._id} className='posts-list__item'>
            <span className='posts-list__title'>{post.title}</span>
            <span className='posts-list__status'>{post.status}</span>
            <button onClick={() => navigate(`/admin/posts/edit/${post._id}`)}>✏️ Edit</button>
            <button onClick={() => handleDelete(post._id)}>🗑️ Delete</button>
          </li>
        ))}
      </ul>
      {showConfirm && (
        <ConfirmDialog
          message='Are you sure you want to delete this post?'
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default PostsList;
