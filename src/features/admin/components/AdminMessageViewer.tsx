// src/features/admin/components/AdminMessageViewer.tsx
import { useEffect, useRef, useState } from 'react';
import api from '../../../shared/utils/axios';
import { ChatMessage } from '../../../shared/types/ChatMessage';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { User } from '../../../shared/types/User';
import '../styles/AdminMessageViewer.scss';

interface AdminMessageViewerProps {
  conversationId: string;
}

export const AdminMessageViewer = ({ conversationId }: AdminMessageViewerProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/api/messages/${conversationId}`);
        setMessages(res.data);
      } catch {
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className='admin-message-viewer'>
        {[...Array(5)].map((_, i) => (
          <div key={i} className='admin-message skeleton-message'></div>
        ))}
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  return (
    <div className='admin-message-viewer'>
      {messages.map((msg) => {
        const sender = msg.sender as User;
        const isAdmin = sender?.role === 'admin';
        const timestamp = new Date(msg.createdAt).toLocaleTimeString();
        const contentHTML = DOMPurify.sanitize(marked.parse(msg.text) as string);

        return (
          <div
            key={msg._id}
            className={`admin-message ${isAdmin ? 'admin' : 'user'} ${
              sender._id === msg.sender ? 'own-message' : ''
            }`}>
            <strong>{sender.name}</strong> <em>({timestamp})</em>:
            <div dangerouslySetInnerHTML={{ __html: contentHTML }} />
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default AdminMessageViewer;
