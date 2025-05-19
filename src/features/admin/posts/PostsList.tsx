// The-Human-Tech-Blog-React/src/features/admin/posts/PostsList.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../shared/utils/axios';
import { Post } from '../../../shared/types/Post';
import '../styles/PostsList.scss';

const PostsList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [drafts, setDrafts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    }
  };

  const fetchDrafts = async () => {
    try {
      const res = await api.get('/drafts');
      setDrafts(res.data);
    } catch (err) {
      console.error('Failed to fetch drafts', err);
    }
  };

  const deleteDraft = async (id: string) => {
    try {
      await api.delete(`/drafts/${id}`);
      setDrafts((prev) => prev.filter((draft) => draft._id !== id));
    } catch (err) {
      console.error('Failed to delete draft', err);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchDrafts();
  }, []);

  return (
    <div className='posts-list'>
      <h2>Published Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <span>{post.title}</span>
            <span>{post.status}</span>
            <button onClick={() => navigate(`/admin/posts/edit/${post._id}`)}>Edit</button>
          </li>
        ))}
      </ul>

      <h2>Drafts</h2>
      <ul>
        {drafts.map((draft) => (
          <li key={draft._id}>
            <span>{draft.title}</span>
            <span>draft</span>
            <button onClick={() => navigate(`/admin/posts/edit/${draft._id}`)}>Continue</button>
            <button onClick={() => deleteDraft(draft._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsList;
