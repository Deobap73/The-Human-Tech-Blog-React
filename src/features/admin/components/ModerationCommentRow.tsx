// The-Human-Tech-Blog-React/src/features/admin/components/ModerationCommentRow.tsx

import React from 'react';
import { ModerationComment } from '../../../shared/types/Comment';
import './ModerationCommentRow.scss';

interface Props {
  comment: ModerationComment;
  onApprove: () => void;
  onReject: () => void;
}

const ModerationCommentRow: React.FC<Props> = ({ comment, onApprove, onReject }) => (
  <div className='moderation-comment-row'>
    <div className='comment-info'>
      <div>
        <b>User:</b> {comment.userId?.name || 'Unknown'}
      </div>
      <div>
        <b>Post:</b> {comment.postId?.title || 'Post'}
      </div>
      <div>
        <b>Date:</b> {new Date(comment.createdAt).toLocaleString()}
      </div>
      <div>
        <b>Status:</b> <span className={`status status-${comment.status}`}>{comment.status}</span>
      </div>
      <div className='comment-text'>{comment.text}</div>
    </div>
    <div className='comment-actions'>
      <button onClick={onApprove} className='approve-btn'>
        Approve
      </button>
      <button onClick={onReject} className='reject-btn'>
        Reject
      </button>
    </div>
  </div>
);

export default ModerationCommentRow;
