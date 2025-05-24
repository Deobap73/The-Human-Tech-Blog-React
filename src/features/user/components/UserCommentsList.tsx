// src/features/user/components/UserCommentsList.tsx

import { useEffect, useState } from 'react';
import api from '../../../shared/utils/axios';

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
    <section className='user-page__comments'>
      <h3>My Comments</h3>
      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment._id}>
              <span>{comment.text}</span>
              <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default UserCommentsList;
