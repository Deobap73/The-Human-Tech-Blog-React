// The-Human-Tech-Blog-React/src/pages/AdminPage/posts/PostsList.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../shared/utils/axios';
import { Post } from '../../../shared/types/Post';
import './PostsList.scss';

const PostsList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    }
  };

  const deletePost = async (id: string) => {
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className='posts-admin'>
      <div className='posts-header'>
        <h2>All Posts</h2>
        <button onClick={() => alert('TODO: Redirect to create page')}>New Post</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post._id}>
              <td>{post.title}</td>
              <td>{post.status}</td>
              <td>{post.author?.name}</td>
              <td>
                <button onClick={() => navigate('/admin/posts/create')}>New Post</button>
                <button onClick={() => alert(`TODO: Edit ${post._id}`)}>Edit</button>
                <button onClick={() => deletePost(post._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostsList;
