// /src/features/post/components/Comments.tsx
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../shared/hooks/useAuth';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import '../styles/Comments.scss';

// Define the props interface for the Comments component
interface CommentsProps {
  postId: string;
  className?: string; // optional class forwarded to wrapper
}

/**
 * Comments wrapper that groups title, form (if user/guest allowed), and list.
 * All static strings are internationalized with react-i18next.
 */
export const Comments = ({ postId, className }: CommentsProps) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [reload, setReload] = useState<boolean>(false);

  // Toggle value to force CommentList refetch
  const handleReload = (): void => setReload((prev) => !prev);

  return (
    <div className={`comments ${className || ''}`.trim()}>
      <h3 className='comments__title'>{t('comments.title')}</h3>

      {/* Only render the form if there is an authenticated user OR guests are allowed.
         Currently we allow guests with consent (handled inside CommentForm). */}
      <CommentForm postId={postId} onCommentAdded={handleReload} />

      <CommentList postId={postId} reload={reload} onDelete={handleReload} />
    </div>
  );
};

export default Comments;
