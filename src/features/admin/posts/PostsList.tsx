// src/features/admin/posts/PostsList.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../shared/utils/axios';
import { Post } from '../../../shared/types/Post';
import '../styles/PostsList.scss';
import { toast } from 'react-hot-toast';

const PostsList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts', err);
      toast.error('Failed to load posts');
    }
  };

  const deletePost = async (id: string) => {
    try {
      await api.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Post deleted');
    } catch (err) {
      console.error('Failed to delete post', err);
      toast.error('Failed to delete post');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className='posts-list'>
      <h2>Admin Post List</h2>
      <button onClick={() => navigate('/admin/posts/create')}>Create New Post</button>
      <ul>
        {posts.map((post) => (
          <li key={post._id} className='post-item'>
            <h3>{post.title}</h3>
            <p>
              <strong>Status:</strong>{' '}
              <span style={{ color: post.status === 'published' ? 'green' : 'gray' }}>
                {post.status}
              </span>
            </p>
            <div className='actions'>
              <button onClick={() => navigate(`/admin/posts/edit/${post._id}`)}>Edit</button>
              <button onClick={() => deletePost(post._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsList;
