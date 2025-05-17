// src/features/admin/pages/AdminMessages.tsx
import AdminMessageViewer from '../components/AdminMessageViewer';
import { useState, useEffect } from 'react';
import api from '../../../shared/utils/axios';
import { Conversation } from '../../../shared/types/Conversation';
import { AxiosError } from 'axios'; // Importe AxiosError para tipagem

const AdminMessages = () => {
  const [conversationId, setConversationId] = useState<string>('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [error, setError] = useState<string>(''); // Adicionado estado de erro

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get<Conversation[]>('/api/conversations');
        setConversations(res.data);
        if (res.data.length > 0) setConversationId(res.data[0]._id);
      } catch (err: unknown) {
        // Usando unknown em vez de any
        let errorMessage = 'Unable to fetch conversations. Please try again.';

        if (err instanceof AxiosError) {
          errorMessage = err.response?.data?.message || err.message || errorMessage;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        console.error('Failed to load conversations:', errorMessage);
        setError(errorMessage);
      }
    };
    fetchConversations();
  }, []);

  return (
    <div className='admin-messages'>
      {error && <div className='error-message'>{error}</div>}
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
