// The-Human-Tech-Blog-React/src/components/bookmarks/BookmarkButton.tsx

import '../styles/BookmarkButton.scss';
import { useState, useEffect, useCallback } from 'react';
import axios from '../../../shared/utils/axios';
import { useAuth } from '../../../shared/hooks/useAuth';
import { IoHeartOutline, IoHeartSharp } from 'react-icons/io5';

interface BookmarkResponse {
  postId: { _id: string };
}

interface BookmarkButtonProps {
  postId: string;
  className?: string; // Added to allow external styling/positioning via className prop
}

export const BookmarkButton = ({ postId, className }: BookmarkButtonProps) => {
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchBookmarks = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axios.get<BookmarkResponse[]>('/bookmarks');
      const found = res.data.find((item) => item.postId._id === postId);
      setBookmarked(!!found);
    } catch (err) {
      console.error('Failed to fetch bookmarks:', err);
      setBookmarked(false);
    }
  }, [user, postId]);

  const toggleBookmark = async () => {
    if (!user || loading) return; // Prevent multiple clicks while loading
    setLoading(true);
    try {
      await axios.post('/bookmarks', { postId });
      // Refetch to ensure state is accurate after toggle
      await fetchBookmarks();
    } catch (err) {
      console.error('Bookmark toggle failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return (
    <button
      className={`bookmark-button ${bookmarked ? 'bookmark-button--active' : ''} ${
        className || ''
      }`}
      onClick={toggleBookmark}
      disabled={!user || loading}
      title={bookmarked ? 'Remove Bookmark' : 'Save to Bookmarks'}
      aria-label={bookmarked ? 'Remove Bookmark' : 'Save to Bookmarks'}>
      {bookmarked ? <IoHeartSharp /> : <IoHeartOutline />}
    </button>
  );
};
