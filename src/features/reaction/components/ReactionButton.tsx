// src/features/reaction/components/ReactionButton.tsx

import { useState, useEffect } from 'react';
import api from '../../../shared/utils/axios';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useSocket } from '../../../shared/hooks/useSocket';

const EMOJIS = ['👍', '😂', '😢', '😮', '😡', '❤️'];

interface ReactionButtonProps {
  targetType: 'post' | 'comment';
  targetId: string;
}

const ReactionButton = ({ targetType, targetId }: ReactionButtonProps) => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [myReactions, setMyReactions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const res = await api.get(`/reactions?targetType=${targetType}&targetId=${targetId}`);
        const reactions = res.data as any[];
        if (user) {
          setMyReactions(reactions.filter((r) => r.userId === user._id).map((r) => r.emoji));
        }
      } catch (err) {
        console.error('Failed to fetch reactions:', err);
        setMyReactions([]);
      }
    };

    fetchReactions();

    if (socket) {
      socket.on('reaction:updated', (payload: { targetType: string; targetId: string }) => {
        if (payload.targetType === targetType && payload.targetId === targetId) {
          fetchReactions();
        }
      });
    }

    return () => {
      socket?.off('reaction:updated');
    };
  }, [targetType, targetId, user, socket]);

  const handleReaction = async (emoji: string) => {
    if (!user || loading || !isConnected) return;

    setLoading(true);
    try {
      await api.post('/reactions', { targetType, targetId, emoji });
      socket?.emit('reaction:toggle', { targetType, targetId, emoji });
    } catch (err) {
      console.error('Failed to send reaction:', err);
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
          disabled={!user || loading || !isConnected}
          className={myReactions.includes(emoji) ? 'active' : ''}
          title={emoji}
          aria-label={`React with ${emoji}`}>
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default ReactionButton;
