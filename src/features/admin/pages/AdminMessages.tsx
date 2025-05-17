// src/features/admin/pages/AdminMessages.tsx
import AdminMessageViewer from '../components/AdminMessageViewer';
import { useState, useEffect } from 'react';
import api from '../../../shared/utils/axios';
import { Conversation } from '../../../shared/types/Conversation';

const AdminMessages = () => {
  const [conversationId, setConversationId] = useState<string>('');
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get<Conversation[]>('/api/conversations');
        setConversations(res.data);
        if (res.data.length > 0) setConversationId(res.data[0]._id);
      } catch {
        console.error('Failed to load conversations');
      }
    };
    fetchConversations();
  }, []);

  return (
    <div className='admin-messages'>
      <aside>
        <ul>
          {conversations.map((c) => (
            <li key={c._id} onClick={() => setConversationId(c._id)}>
              {c.participants.map((p) => (typeof p === 'string' ? 'Unknown' : p.name)).join(', ')}
            </li>
          ))}
        </ul>
      </aside>
      <section>
        {conversationId ? (
          <AdminMessageViewer conversationId={conversationId} />
        ) : (
          <p>Select a conversation</p>
        )}
      </section>
    </div>
  );
};

export default AdminMessages;
