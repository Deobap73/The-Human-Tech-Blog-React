// The-Human-Tech-Blog-React/src/components/comments/CommentList.tsx

import './CommentList.scss';
import { useEffect, useState } from 'react';
import axios from '../../utils/axios';

interface Comment {
  _id: string;
  userName: string;
  text: string;
  createdAt: string;
}

export const CommentList = ({ postId }: { postId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/comments/${postId}`);
        setComments(res.data);
      } catch {
        console.error('Failed to fetch comments');
      }
    };
    fetchComments();
  }, [postId]);

  return (
    <div className='comment-list'>
      <h3 className='comment-list__title'>Comments</h3>
      {comments.length === 0 ? (
        <p className='comment-list__empty'>No comments yet.</p>
      ) : (
        <ul className='comment-list__items'>
          {comments.map((comment) => (
            <li key={comment._id} className='comment-list__item'>
              <div className='comment-list__item__user'>{comment.userName}</div>
              <div className='comment-list__item__text'>{comment.text}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
