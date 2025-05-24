// src/features/user/components/UserBookmarksList.tsx

import { useEffect, useState } from 'react';
import api from '../../../shared/utils/axios';

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
    <section className='user-page__favorites'>
      <h3>My Favorites</h3>
      {loading ? (
        <p>Loading bookmarks...</p>
      ) : bookmarks.length === 0 ? (
        <p>No bookmarks yet.</p>
      ) : (
        <ul>
          {bookmarks.map((bm) => (
            <li key={bm._id}>
              <a href={`/posts/${bm.postId.slug}`}>{bm.postId.title}</a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default UserBookmarksList;
