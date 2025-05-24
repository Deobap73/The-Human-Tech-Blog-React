// src/components/comments/CommentList.tsx

import { useEffect, useState } from 'react';
import axios from '../../../shared/utils/axios';
import { useAuth } from '../../../shared/hooks/useAuth';
import { toast } from 'react-hot-toast';

interface Comment {
  _id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

interface Props {
  postId: string;
  reload: boolean;
  onDelete?: () => void;
}

const CommentList = ({ postId, reload, onDelete }: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/comments/${postId}`);
        setComments(res.data);
      } catch {
        toast.error('Failed to fetch comments');
      }
    };
    fetchComments();
  }, [postId, reload]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await axios.delete(`/comments/${id}`);
      toast.success('Comment deleted');
      if (onDelete) onDelete();
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <ul className='comments__list'>
      {comments.map((c) => (
        <li key={c._id} className='comments__item'>
          <p className='comments__author'>{c.userName}</p>
          <p className='comments__text'>{c.text}</p>
          <span className='comments__date'>{new Date(c.createdAt).toLocaleString()}</span>
          {user && (user._id === c.userId || user.role === 'admin') && (
            <button className='comments__delete' onClick={() => handleDelete(c._id)}>
              Delete
            </button>
          )}
        </li>
      ))}
      {comments.length === 0 && (
        <li className='comments__item comments__item--empty'>No comments yet.</li>
      )}
    </ul>
  );
};

export default CommentList;
