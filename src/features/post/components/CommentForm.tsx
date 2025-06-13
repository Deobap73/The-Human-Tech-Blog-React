// src/features/post/components/CommentForm.tsx

import { useState } from 'react';
import axios from '../../../shared/utils/axios';
import { toast } from 'react-hot-toast'; // Ensure 'react-hot-toast' is installed if used

interface CommentFormProps {
  // Renamed Props to CommentFormProps for clarity
  postId: string;
  onCommentAdded: () => void;
}

const CommentForm = ({ postId, onCommentAdded }: CommentFormProps) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error('Comment cannot be empty!'); // Added toast for empty comment
      return;
    }
    setLoading(true);
    try {
      await axios.post('/comments', { text, postId });
      setText('');
      toast.success('Comment added!');
      onCommentAdded();
    } catch (err) {
      // Catch specific error for more info
      console.error('Failed to add comment:', err);
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
        rows={3} // Added rows attribute for better usability
      />
      <button className='comments__submit' type='submit' disabled={loading}>
        {loading ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
};

export default CommentForm;
