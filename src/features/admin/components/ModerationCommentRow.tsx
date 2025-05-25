// The-Human-Tech-Blog-React/src/features/admin/components/ModerationCommentRow.tsx

import React from 'react';
import { ModerationComment } from '../../../shared/types/Comment';
import '../styles/ModerationCommentRow.scss';

interface Props {
  comment: ModerationComment;
  onApprove: () => void;
  onReject: () => void;
}

const ModerationCommentRow: React.FC<Props> = ({ comment, onApprove, onReject }) => (
  <div className='moderation-comment-row'>
    <div className='moderation-comment-row__info'>
      <div className='moderation-comment-row__user'>
        <b>User:</b> {comment.userId?.name || 'Unknown'}
      </div>
      <div className='moderation-comment-row__post'>
        <b>Post:</b> {comment.postId?.title || 'Post'}
      </div>
      <div className='moderation-comment-row__date'>
        <b>Date:</b> {new Date(comment.createdAt).toLocaleString()}
      </div>
      <div
        className={`moderation-comment-row__status moderation-comment-row__status--${comment.status}`}>
        <b>Status:</b> <span>{comment.status}</span>
      </div>
      <div className='moderation-comment-row__text'>{comment.text}</div>
    </div>
    <div className='moderation-comment-row__actions'>
      <button
        className='moderation-comment-row__btn moderation-comment-row__btn--approve'
        onClick={onApprove}>
        Approve
      </button>
      <button
        className='moderation-comment-row__btn moderation-comment-row__btn--reject'
        onClick={onReject}>
        Reject
      </button>
    </div>
  </div>
);

export default ModerationCommentRow;
