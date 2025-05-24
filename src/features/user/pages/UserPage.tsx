// src/features/user/pages/UserPage.tsx

import { useEffect, useState } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
import BookmarkList from '../../post/components/BookmarkList';
import api from '../../../shared/utils/axios';
import { Post } from '../../../shared/types/Post';
import './UserPage.scss';

export const UserPage = () => {
  const { user, logout } = useAuth();
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Fetch user's posts on mount
  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!user) return;
      try {
        const res = await api.get<Post[]>(`/posts?author=${user._id}`);
        setMyPosts(res.data);
      } catch (err) {
        setMyPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchMyPosts();
  }, [user]);

  if (!user) {
    return (
      <div className='user-page__unauth'>
        <h2>You need to be logged in to view your profile.</h2>
      </div>
    );
  }

  return (
    <div className='user-page'>
      <section className='user-page__profile'>
        <div className='user-page__avatar'>
          <img
            src={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${user._id}`}
            alt={user.name}
            width={80}
            height={80}
          />
        </div>
        <div className='user-page__info'>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <button className='user-page__logout-btn' onClick={logout}>
            Logout
          </button>
        </div>
      </section>

      <section className='user-page__myposts'>
        <h3>My Posts</h3>
        {loadingPosts ? (
          <p>Loading posts...</p>
        ) : myPosts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <ul className='user-page__postlist'>
            {myPosts.map((post) => (
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

      <section className='user-page__favorites'>
        <h3>My Favorites</h3>
        <BookmarkList />
      </section>
    </div>
  );
};

export default UserPage;
