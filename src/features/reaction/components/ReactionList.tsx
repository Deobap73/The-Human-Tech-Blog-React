// src/features/reaction/components/ReactionList.tsx

import { useEffect, useState } from 'react';
import api from '../../../shared/utils/axios';

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

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/reactions?targetType=${targetType}&targetId=${targetId}`);
        setReactions(res.data);
      } catch {
        setReactions([]);
      }
    };
    fetch();
  }, [targetType, targetId]);

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
