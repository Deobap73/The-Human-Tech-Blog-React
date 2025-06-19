// The-Human-Tech-Blog-React/src/features/chat/components/ ChatSidebar.tsx

import { useEffect, useState } from 'react';
import api from '../../../shared/utils/axios';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useTranslation } from 'react-i18next';

interface Conversation {
  _id: string;
  participants: { _id: string; name: string }[];
}

const ChatSidebar = ({ onSelect }: { onSelect: (id: string) => void }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/conversations');
        setConversations(res.data);
      } catch {
        setConversations([]);
      }
    };
    fetchConversations();
  }, []);

  return (
    <aside className='chat-sidebar'>
      <h3>{t('chat.title')}</h3>
      <ul>
        {conversations.map((conv) => (
          <li key={conv._id} onClick={() => onSelect(conv._id)}>
            {conv.participants
              .map((p) => p.name)
              .filter((name) => name !== user?.name)
              .join(', ') || t('chat.noName')}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ChatSidebar;
