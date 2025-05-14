// src/features/admin/components/AdminMessageViewer.tsx
import { useEffect, useState, useCallback } from 'react';
import api from '../../../shared/utils/axios';
import { useAuth } from '../../../features/auth/services/useAuth';
import AdminMessageInput from './AdminMessageInput';

interface Message {
  _id: string;
  text: string;
  sender: string;
  createdAt: string;
}

interface Props {
  conversationId: string;
}

const AdminMessageViewer = ({ conversationId }: Props) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await api.get(`/api/messages/${conversationId}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  }, [conversationId]);

  useEffect(() => {
    if (conversationId) fetchMessages();
  }, [conversationId, fetchMessages]);

  return (
    <section className='admin-message-viewer'>
      <h4>Conversation</h4>
      <ul>
        {messages.map((msg) => (
          <li key={msg._id} className={msg.sender === user?._id ? 'sent' : 'received'}>
            <p>{msg.text}</p>
            <span>{new Date(msg.createdAt).toLocaleString()}</span>
          </li>
        ))}
      </ul>
      <AdminMessageInput conversationId={conversationId} onSent={fetchMessages} />
    </section>
  );
};

export default AdminMessageViewer;
