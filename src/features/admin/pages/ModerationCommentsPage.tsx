// The-Human-Tech-Blog-React/src/features/admin/pages/ModerationCommentsPage.tsx

import { useEffect, useState } from 'react';
import api from '../../../shared/utils/axios';
import { ModerationComment } from '../../../shared/types/Comment';
import ModerationCommentRow from '../components/ModerationCommentRow';
import '../styles/ModerationCommentsPage.scss';

const ModerationCommentsPage = () => {
  const [comments, setComments] = useState<ModerationComment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingComments = async () => {
    setLoading(true);
    try {
      const res = await api.get<ModerationComment[]>('/comments/moderation');
      setComments(res.data);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    await api.patch(`/comments/${id}/approve`);
    fetchPendingComments();
  };

  const handleReject = async (id: string) => {
    await api.patch(`/comments/${id}/reject`);
    fetchPendingComments();
  };

  useEffect(() => {
    fetchPendingComments();
  }, []);

  return (
    <div className='moderation-page'>
      <h2 className='moderation-page__title'>Comment Moderation</h2>
      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length > 0 ? (
        comments.map((comment) => (
          <ModerationCommentRow
            key={comment._id}
            comment={comment}
            onApprove={() => handleApprove(comment._id)}
            onReject={() => handleReject(comment._id)}
          />
        ))
      ) : (
        <p>No comments pending moderation.</p>
      )}
    </div>
  );
};

export default ModerationCommentsPage;
