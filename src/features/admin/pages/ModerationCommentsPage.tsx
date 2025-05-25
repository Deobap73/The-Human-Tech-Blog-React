// The-Human-Tech-Blog-React/src/features/admin/pages/ModerationCommentsPage.tsx

import { useEffect, useState } from 'react';
import api from '../../../shared/utils/axios';
import { toast } from 'react-hot-toast';
import ModerationCommentRow from '../components/ModerationCommentRow';
import { Comment } from '../../../shared/types';
import '../styles/ModerationCommentsPage.scss';

const ModerationCommentsPage = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingComments = async () => {
    setLoading(true);
    try {
      const res = await api.get<Comment[]>('/comments?status=pending');
      setComments(res.data);
    } catch {
      toast.error('Failed to fetch pending comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingComments();
  }, []);

  const handleStatusChange = async (id: string, action: 'approve' | 'reject') => {
    try {
      await api.patch(`/comments/${id}/${action}`);
      toast.success(`Comment ${action}d!`);
      setComments(comments.filter((c) => c._id !== id));
    } catch {
      toast.error('Failed to update comment status');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className='moderation-page'>
      <h2>Moderate Comments</h2>
      {comments.length === 0 ? (
        <p>No comments to moderate 🎉</p>
      ) : (
        <div className='moderation-comments-list'>
          {comments.map((comment) => (
            <ModerationCommentRow
              key={comment._id}
              comment={comment}
              onApprove={() => handleStatusChange(comment._id, 'approve')}
              onReject={() => handleStatusChange(comment._id, 'reject')}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ModerationCommentsPage;
