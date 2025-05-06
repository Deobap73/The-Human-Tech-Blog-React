// The-Human-Tech-Blog-React/src/components/comments/Comments.tsx

import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import axios from '../../utils/axios';
import './Comments.scss';

interface Comment {
  _id: string;
  postId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export const Comments = ({ postId }: { postId: string }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');

  const fetchComments = async () => {
    const res = await axios.get(`/comments/${postId}`);
    setComments(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;
    await axios.post('/comments', { text, postId });
    setText('');
    fetchComments();
  };

  useEffect(() => {
    const fetchComments = async () => {
      const res = await axios.get(`/comments/${postId}`);
      setComments(res.data);
    };
    fetchComments();
  }, [postId]);

  return (
    <div className='comments'>
      <h3 className='comments__title'>Comments</h3>
      {user && (
        <form className='comments__form' onSubmit={handleSubmit}>
          <textarea
            className='comments__textarea'
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='Write a comment...'
            required
          />
          <button className='comments__submit' type='submit'>
            Post
          </button>
        </form>
      )}
      <ul className='comments__list'>
        {comments.map((c) => (
          <li key={c._id} className='comments__item'>
            <p className='comments__author'>{c.userName}</p>
            <p className='comments__text'>{c.text}</p>
            <span className='comments__date'>{new Date(c.createdAt).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
