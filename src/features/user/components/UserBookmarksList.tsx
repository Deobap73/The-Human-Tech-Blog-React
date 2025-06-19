// src/features/user/components/UserBookmarksList.tsx

import { useEffect, useState } from 'react';
import api from '../../../shared/utils/axios';
import '../styles/UserBookmarksList.scss';

interface Bookmark {
  _id: string;
  postId: {
    _id: string;
    title: string;
    slug: string;
    image?: string;
  };
}

const UserBookmarksList = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/users/me/bookmarks')
      .then((res) => setBookmarks(res.data))
      .catch(() => setBookmarks([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className='user-bookmarks'>
      <h3 className='user-bookmarks__header'>My Favorites</h3>
      {loading ? (
        <div className='user-bookmarks__loading'>Loading bookmarks...</div>
      ) : bookmarks.length === 0 ? (
        <div className='user-bookmarks__empty'>No bookmarks yet.</div>
      ) : (
        <ul className='user-bookmarks__list'>
          {bookmarks.map((bm) => (
            <li key={bm._id} className='user-bookmarks__item'>
              {bm.postId.image && (
                <img
                  src={bm.postId.image}
                  alt={bm.postId.title}
                  className='user-bookmarks__thumb'
                  width={44}
                  height={44}
                />
              )}
              <a href={`/posts/${bm.postId.slug}`} className='user-bookmarks__link'>
                {bm.postId.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default UserBookmarksList;
