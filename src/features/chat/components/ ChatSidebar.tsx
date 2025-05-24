// The-Human-Tech-Blog-React/src/features/chat/components/ ChatSidebar.tsx

import { useEffect, useState } from 'react';
import api from '../../../shared/utils/axios';
import { useAuth } from '../../../shared/hooks/useAuth';

interface Conversation {
  _id: string;
  participants: { _id: string; name: string }[];
}

const ChatSidebar = ({ onSelect }: { onSelect: (id: string) => void }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);

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
      <h3>Chats</h3>
      <ul>
        {conversations.map((conv) => (
          <li key={conv._id} onClick={() => onSelect(conv._id)}>
            {conv.participants
              .map((p) => p.name)
              .filter((name) => name !== user?.name)
              .join(', ') || 'No Name'}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ChatSidebar;
