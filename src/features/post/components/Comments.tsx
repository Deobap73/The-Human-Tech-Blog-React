// src/components/comments/Comments.tsx

import { useState } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import '../styles/Comments.scss';

export const Comments = ({ postId }: { postId: string }) => {
  const { user } = useAuth();
  const [reload, setReload] = useState(false);

  const handleReload = () => setReload((prev) => !prev);

  return (
    <div className='comments'>
      <h3 className='comments__title'>Comments</h3>
      {user && <CommentForm postId={postId} onCommentAdded={handleReload} />}
      <CommentList postId={postId} reload={reload} onDelete={handleReload} />
    </div>
  );
};

export default Comments;
