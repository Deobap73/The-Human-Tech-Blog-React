// src/features/user/components/UserPostsList.tsx

import { useEffect, useState } from 'react';
import api from '../../../shared/utils/axios';
import { Post } from '../../../shared/types/Post';

const UserPostsList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/users/me/posts')
      .then((res) => setPosts(res.data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className='user-page__myposts'>
      <h3>My Posts</h3>
      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul className='user-page__postlist'>
          {posts.map((post) => (
            <li key={post._id} className='user-page__postitem'>
              <a href={`/posts/${post.slug}`} className='user-page__postlink'>
                <strong>{post.title}</strong>
              </a>
              <span className='user-page__postdate'>
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default UserPostsList;
