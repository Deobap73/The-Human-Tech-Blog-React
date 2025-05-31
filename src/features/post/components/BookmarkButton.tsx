// The-Human-Tech-Blog-React/src/components/bookmarks/BookmarkButton.tsx

import '../styles/BookmarkButton.scss';
import { useState, useEffect, useCallback } from 'react';
import axios from '../../../shared/utils/axios';
import { useAuth } from '../../../shared/hooks/useAuth';
import { IoHeartOutline, IoHeartSharp } from 'react-icons/io5';

interface BookmarkResponse {
  postId: { _id: string };
}

export const BookmarkButton = ({ postId }: { postId: string }) => {
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Obtém os favoritos do utilizador e atualiza estado
  const fetchBookmarks = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axios.get<BookmarkResponse[]>('/bookmarks');
      const found = res.data.find((item) => item.postId._id === postId);
      setBookmarked(!!found);
    } catch {
      setBookmarked(false);
    }
  }, [user, postId]);

  // Alterna favorito e atualiza estado real depois
  const toggleBookmark = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await axios.post('/bookmarks', { postId });
      // Refaz o fetch para garantir estado correto
      await fetchBookmarks();
    } catch (err) {
      console.error('Bookmark failed', err);
    } finally {
      setLoading(false);
    }
  };

  // Atualiza favoritos ao logar ou mudar postId
  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return (
    <button
      className={`bookmark-button ${bookmarked ? 'active' : ''}`}
      onClick={toggleBookmark}
      disabled={!user || loading}
      title={bookmarked ? 'Remove Bookmark' : 'Save to Bookmarks'}>
      {bookmarked ? <IoHeartOutline /> : <IoHeartSharp />}
    </button>
  );
};
