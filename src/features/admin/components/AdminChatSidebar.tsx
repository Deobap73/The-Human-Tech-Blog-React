import { useEffect, useState } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
import api from '../../../shared/utils/axios';
import '../styles/Sidebar.scss';

interface Conversation {
  _id: string;
  participants: { _id: string; name: string }[];
}

const AdminChatSidebar = ({ onSelect }: { onSelect: (id: string) => void }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/conversations');
        setConversations(res.data);
      } catch {
        console.error('Failed to load conversations');
      }
    };

    if (user?.role === 'admin') {
      fetchConversations();
    }
  }, [user]);

  return (
    <aside className='admin-sidebar'>
      <h3>Chats</h3>
      <ul className='admin-sidebar__list'>
        {conversations.map((conv) => (
          <li key={conv._id} onClick={() => onSelect(conv._id)} className='admin-sidebar__item'>
            {conv.participants.map((p) => p.name).join(', ')}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default AdminChatSidebar;
