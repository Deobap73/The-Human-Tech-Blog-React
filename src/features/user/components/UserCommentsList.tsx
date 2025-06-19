// src/features/user/components/UserCommentsList.tsx

import { useEffect, useState } from 'react';
import api from '../../../shared/utils/axios';
import '../styles/UserCommentsList.scss';

interface Comment {
  _id: string;
  text: string;
  createdAt: string;
  postId: string;
}

const UserCommentsList = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/users/me/comments')
      .then((res) => setComments(res.data))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className='user-comments'>
      <h3 className='user-comments__header'>My Comments</h3>
      {loading ? (
        <div className='user-comments__loading'>Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className='user-comments__empty'>No comments yet.</div>
      ) : (
        <ul className='user-comments__list'>
          {comments.map((comment) => (
            <li key={comment._id} className='user-comments__item'>
              <span className='user-comments__text'>{comment.text}</span>
              <span className='user-comments__date'>
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default UserCommentsList;
