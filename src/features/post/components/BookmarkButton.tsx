// The-Human-Tech-Blog-React/src/components/bookmarks/BookmarkButton.tsx

import '../styles/BookmarkButton.scss';
import { useState, useEffect, useCallback } from 'react';
import axios from '../../../shared/utils/axios';
import { useAuth } from '../../../shared/hooks/useAuth';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

interface BookmarkResponse {
  postId: { _id: string };
}

export const BookmarkButton = ({ postId }: { postId: string }) => {
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);

  const fetchBookmarks = useCallback(async () => {
    try {
      const res = await axios.get<BookmarkResponse[]>('/bookmarks');
      const found = res.data.find((item) => item.postId._id === postId);
      setBookmarked(!!found);
    } catch {
      setBookmarked(false);
    }
  }, [postId]);

  const toggleBookmark = async () => {
    try {
      await axios.post('/bookmarks', { postId });
      setBookmarked((prev) => !prev);
    } catch (err) {
      console.error('Bookmark failed', err);
    }
  };

  useEffect(() => {
    if (user) fetchBookmarks();
  }, [user, fetchBookmarks]);

  return (
    <button
      className={`bookmark-button ${bookmarked ? 'active' : ''}`}
      onClick={toggleBookmark}
      disabled={!user}
      title={bookmarked ? 'Remove Bookmark' : 'Save to Bookmarks'}>
      {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
    </button>
  );
};
