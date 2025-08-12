// /src/features/post/components/CommentList.tsx
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';
import axios from '../../../shared/utils/axios';
import { useAuth } from '../../../shared/hooks/useAuth';
import { toast } from 'react-hot-toast';

// Safe converter for unknown IDs to string
function toStrId(id: unknown): string {
  return typeof id === 'string' ? id : (id as any)?.toString?.() ?? '';
}

interface Comment {
  _id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

interface Props {
  postId: string;
  reload?: boolean;
  onDelete?: () => void;
}

/**
 * Renders the list of comments for a given post.
 * All user-facing strings are translated with i18n keys under "comments".
 */
const CommentList = ({ postId, reload = false, onDelete }: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const { user } = useAuth();
  const { t } = useTranslation();

  // Fetch comments
  useEffect(() => {
    const fetchComments = async (): Promise<void> => {
      try {
        const res = await axios.get<Comment[]>(`/comments/${postId}`);
        setComments(res.data);
      } catch {
        toast.error(t('comments.fetchError'));
      }
    };
    void fetchComments();
  }, [postId, reload, t]);

  // Delete comment
  const handleDelete = async (id: string): Promise<void> => {
    // Confirm dialog is also translated
    const ok = window.confirm(t('comments.deleteConfirm'));
    if (!ok) return;

    try {
      await axios.delete(`/comments/${id}`);
      setComments((prev) => prev.filter((c) => c._id !== id));
      toast.success(t('comments.deleteSuccess'));
      if (onDelete) onDelete();
    } catch {
      toast.error(t('comments.deleteError'));
    }
  };

  return (
    <ul className='comments__list' aria-live='polite'>
      {comments.map((c) => (
        <li key={c._id} className='comments__item'>
          <p className='comments__author'>{c.userName}</p>
          <p className='comments__text'>{c.text}</p>

          {/* Use active i18n language to format date consistently */}
          <span className='comments__date'>
            {new Date(c.createdAt).toLocaleString(i18n.language || 'en')}
          </span>

          {/* Only author or admin can delete */}
          {user && (toStrId(user._id) === toStrId(c.userId) || user.role === 'admin') && (
            <button
              type='button'
              className='comments__delete'
              onClick={() => void handleDelete(c._id)}
              aria-label={t('comments.deleteButton')}>
              {t('comments.deleteButton')}
            </button>
          )}
        </li>
      ))}

      {comments.length === 0 && (
        <li className='comments__item comments__item--empty'>{t('comments.empty')}</li>
      )}
    </ul>
  );
};

export default CommentList;
