// src/features/reaction/components/ReactionButton.tsx

import { useState, useEffect } from 'react';
import api from '../../../shared/utils/axios';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useSocketContext } from '../../../shared/context/SocketContext';

const EMOJIS = ['👍', '😂', '😢', '😮', '😡', '❤️'];

interface ReactionButtonProps {
  targetType: 'post' | 'comment';
  targetId: string;
}

const ReactionButton = ({ targetType, targetId }: ReactionButtonProps) => {
  const { user } = useAuth();
  const { socket } = useSocketContext();
  const [myReactions, setMyReactions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Busca minhas reações ao target
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const res = await api.get(`/reactions?targetType=${targetType}&targetId=${targetId}`);
        const reactions = res.data as any[];
        if (user) {
          setMyReactions(reactions.filter((r) => r.userId === user._id).map((r) => r.emoji));
        }
      } catch {
        setMyReactions([]);
      }
    };
    fetchReactions();
    if (socket) {
      socket.on('reaction:update', fetchReactions);
      return () => {
        socket.off('reaction:update', fetchReactions);
      };
    }
  }, [targetType, targetId, user, socket]);

  const handleReaction = async (emoji: string) => {
    setLoading(true);
    try {
      await api.post('/reactions', { targetType, targetId, emoji });
      // Notifica outros via socket
      socket?.emit('reaction:toggle', { targetType, targetId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='reaction-button'>
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => handleReaction(emoji)}
          disabled={!user || loading}
          className={myReactions.includes(emoji) ? 'active' : ''}
          title={emoji}>
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default ReactionButton;
