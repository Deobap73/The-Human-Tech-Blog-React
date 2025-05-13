// The-Human-Tech-Blog-React/src/components/reactions/ReactionButtons.tsx

import '../styles/ReactionButtons.scss';
import { useCallback, useEffect, useState } from 'react';
import axios from './shared/utils/axios';
import { useAuth } from './features/auth/services/useAuth';

interface Reaction {
  _id: string;
  count: number;
}

const reactionsConfig: Record<string, string> = {
  like: '👍',
  love: '❤️',
  funny: '😂',
  sad: '😢',
  angry: '😠',
};

export const ReactionButtons = ({ postId }: { postId: string }) => {
  const { user } = useAuth();
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<string | null>(null);

  const fetchReactions = useCallback(async () => {
    const res = await axios.get(`/reactions/${postId}`);
    const data = res.data;
    const mapped: Record<string, number> = {};
    data.forEach((r: Reaction) => (mapped[r._id] = r.count));
    setReactions(mapped);
  }, [postId]);

  const handleReaction = async (type: string) => {
    setSelected(type);
    await axios.post('/reactions', { postId, type });
    fetchReactions();
  };

  useEffect(() => {
    fetchReactions();
  }, [fetchReactions]);

  return (
    <div className='reactions'>
      {Object.entries(reactionsConfig).map(([type, emoji]) => (
        <button
          key={type}
          className={`reactions__btn reactions__btn--${type} ${selected === type ? 'active' : ''}`}
          onClick={() => handleReaction(type)}
          disabled={!user}>
          {emoji} {reactions[type] || 0}
        </button>
      ))}
    </div>
  );
};
