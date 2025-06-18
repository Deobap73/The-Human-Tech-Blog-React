import '../styles/ReactionButtons.scss';
import { useCallback, useEffect, useState } from 'react';
import api from '../../../shared/utils/axios';
import { useAuth } from '../../../shared/hooks/useAuth';

const EMOJIS = [
  { type: 'like', emoji: '👍' },
  { type: 'love', emoji: '❤️' },
  { type: 'funny', emoji: '😂' },
  { type: 'sad', emoji: '😢' },
  { type: 'angry', emoji: '😠' },
];

interface Reaction {
  userId: string;
  type: string;
}

interface Props {
  postId: string;
}

export const ReactionButtons = ({ postId }: Props) => {
  const { user } = useAuth();
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<string | null>(null);

  // Busca as reações do post (novo padrão)
  const fetchReactions = useCallback(async () => {
    try {
      const res = await api.get(`/reactions?targetType=post&targetId=${postId}`);
      const data = res.data as any[];
      // Conta quantas vezes cada type aparece (podes adaptar para emoji se preferires)
      const mapped: Record<string, number> = {};
      data.forEach((r: any) => {
        mapped[r.emoji] = (mapped[r.emoji] || 0) + 1;
        if (user && r.userId === user._id) setSelected(r.emoji);
      });
      setReactions(mapped);
    } catch {
      setReactions({});
    }
  }, [postId, user]);

  const handleReaction = async (type: string) => {
    setSelected(type);
    await api.post('/reactions', { targetType: 'post', targetId: postId, emoji: type });
    fetchReactions();
  };

  useEffect(() => {
    fetchReactions();
    // eslint-disable-next-line
  }, [fetchReactions]);

  return (
    <div className='reactions'>
      {EMOJIS.map(({ type, emoji }) => (
        <button
          key={type}
          className={`reactions__btn reactions__btn--${type} ${selected === type ? 'active' : ''}`}
          onClick={() => handleReaction(emoji)}
          disabled={!user}>
          {emoji} {reactions[emoji] || 0}
        </button>
      ))}
    </div>
  );
};

export default ReactionButtons;
