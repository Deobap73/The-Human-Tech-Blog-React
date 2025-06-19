// src/features/user/components/UserPostsList.tsx

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../../shared/utils/axios';
import { Post, PostTranslation } from '../../../shared/types/Post';
import { getPostTranslation } from '../../../shared/utils/i18nHelpers';
import '../styles/UserPostsList.scss';

const UserPostsList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    api
      .get('/users/me/posts')
      .then((res) => setPosts(res.data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className='user-posts'>
      <h3 className='user-posts__header'>My Posts</h3>
      {loading ? (
        <div className='user-posts__loading'>Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className='user-posts__empty'>No posts yet.</div>
      ) : (
        <ul className='user-posts__list'>
          {posts.map((post) => {
            const translation: PostTranslation = getPostTranslation(
              post.translations,
              i18n.language
            );
            return (
              <li key={post._id} className='user-posts__item'>
                <a href={`/posts/${post.slug}`} className='user-posts__link'>
                  <span className='user-posts__title'>{translation.title}</span>
                </a>
                <span className='user-posts__date'>
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default UserPostsList;
