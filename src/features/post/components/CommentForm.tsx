// src/features/post/components/CommentForm.tsx

import { useState } from 'react';
import axios from '../../../shared/utils/axios';
import { toast } from 'react-hot-toast';

interface Props {
  postId: string;
  onCommentAdded: () => void;
}

const CommentForm = ({ postId, onCommentAdded }: Props) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      await axios.post('/comments', { text, postId });
      setText('');
      toast.success('Comment added!');
      onCommentAdded();
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className='comments__form' onSubmit={handleSubmit}>
      <textarea
        className='comments__textarea'
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Write a comment...'
        required
        disabled={loading}
      />
      <button className='comments__submit' type='submit' disabled={loading}>
        {loading ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
};

export default CommentForm;
