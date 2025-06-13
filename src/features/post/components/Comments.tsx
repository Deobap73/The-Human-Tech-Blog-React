// The-Human-Tech-Blog-React/src/features/post/components/Comments.tsx

import { useState } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
import CommentForm from './CommentForm'; // This import might need adjustment if CommentForm moves
import CommentList from './CommentList'; // This import might need adjustment if CommentList moves
import '../styles/Comments.scss';

// Define the props interface for the Comments component
interface CommentsProps {
  postId: string;
  className?: string; // <--- Add this line to accept the className prop
}

export const Comments = ({ postId, className }: CommentsProps) => {
  const { user } = useAuth();
  const [reload, setReload] = useState(false);

  const handleReload = () => setReload((prev) => !prev);

  return (
    <div className={`comments ${className || ''}`}>
      {' '}
      {/* Apply the className here */}
      <h3 className='comments__title'>Comments</h3>
      {user && <CommentForm postId={postId} onCommentAdded={handleReload} />}
      <CommentList postId={postId} reload={reload} onDelete={handleReload} />
    </div>
  );
};

export default Comments;
