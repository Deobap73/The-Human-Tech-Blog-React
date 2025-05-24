// src/features/reaction/components/ReactionList.tsx

import { useEffect, useState, useCallback } from 'react';
import api from '../../../shared/utils/axios';
import { useRealtimeReactions } from '../../../shared/hooks/useRealtimeReactions';

interface Props {
  targetType: 'post' | 'comment';
  targetId: string;
}

interface Reaction {
  _id: string;
  userId: string;
  emoji: string;
}

const EMOJIS = ['👍', '😂', '😢', '😮', '😡', '❤️'];

const ReactionList = ({ targetType, targetId }: Props) => {
  const [reactions, setReactions] = useState<Reaction[]>([]);

  const fetchReactions = useCallback(async () => {
    try {
      const res = await api.get(`/reactions?targetType=${targetType}&targetId=${targetId}`);
      setReactions(res.data);
    } catch {
      setReactions([]);
    }
  }, [targetType, targetId]);

  useEffect(() => {
    fetchReactions();
  }, [fetchReactions]);

  useRealtimeReactions(targetType, targetId, () => {
    fetchReactions();
  });

  return (
    <div className='reaction-list'>
      {EMOJIS.map((emoji) => {
        const count = reactions.filter((r) => r.emoji === emoji).length;
        return (
          <span key={emoji} className='reaction-list__item'>
            {emoji} {count > 0 ? count : ''}
          </span>
        );
      })}
    </div>
  );
};

export default ReactionList;
