// src/features/post/components/BookmarkList.tsx

import { useEffect, useState } from 'react';
import axios from '../../../shared/utils/axios';
import { Link } from 'react-router-dom';
import { Post } from '../../../shared/types/Post';

interface Bookmark {
  _id: string;
  postId: Post; // Populado pelo backend
}

const BookmarkList = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await axios.get('/bookmarks');
        setBookmarks(res.data);
      } catch {
        setBookmarks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  if (loading) return <p>Loading favorites...</p>;

  return (
    <div className='bookmark-list'>
      <h2>My Favorites</h2>
      {bookmarks.length === 0 && <p>No favorites yet.</p>}
      <ul>
        {bookmarks.map((b) => (
          <li key={b._id}>
            <Link to={`/posts/${b.postId.slug}`}>{b.postId.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookmarkList;
