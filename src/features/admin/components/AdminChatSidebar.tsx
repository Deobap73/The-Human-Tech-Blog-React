// src/features/admin/components/AdminChatSidebar.tsx
import { useEffect, useState } from 'react';
import api from '../../../shared/utils/axios';
import { useAuth } from '../../../shared/hooks/useAuth';

interface IUser {
  _id: string;
  name: string;
  role: string;
}

interface Conversation {
  _id: string;
  participants: IUser[];
}

interface Props {
  onSelect: (conversationId: string) => void;
}

const AdminChatSidebar = ({ onSelect }: Props) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user || user.role !== 'admin') return;
      try {
        const res = await api.get(`/api/conversations/${user._id}`);
        setConversations(res.data);
      } catch (err) {
        console.error('Failed to load conversations', err);
      }
    };
    fetchConversations();
  }, [user]);

  return (
    <aside className='admin-chat-sidebar'>
      <h3>Chats</h3>
      <ul>
        {conversations.map((conv) => {
          const participant = conv.participants.find((p) => p._id !== user?._id);
          return (
            <li key={conv._id} onClick={() => onSelect(conv._id)}>
              {participant?.name || 'Unknown User'}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default AdminChatSidebar;
