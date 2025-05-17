// src/features/admin/components/AdminMessageViewer.tsx
import { useEffect, useRef, useState } from 'react';
import api from '../../../shared/utils/axios';
import { ChatMessage } from '../../../shared/types/ChatMessage';
import { ChatMessageSchema } from '../../../shared/schemas/ChatMessageSchema';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { io } from 'socket.io-client';
import { User } from '../../../shared/types/User';

interface AdminMessageViewerProps {
  conversationId: string;
}

const socket = io(import.meta.env.VITE_API_BASE_URL, {
  withCredentials: true,
});

export const AdminMessageViewer = ({ conversationId }: AdminMessageViewerProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${conversationId}`); // corrected endpoint
        setMessages(res.data);
      } catch (err) {
        console.error('Fetch failed:', err);
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

  useEffect(() => {
    socket.emit('joinConversation', conversationId);

    const handleNewMessage = (msg: unknown) => {
      const parsed = ChatMessageSchema.safeParse(msg);
      if (!parsed.success) return;

      const safeMsg = parsed.data;
      const message: ChatMessage = {
        ...safeMsg,
        sender:
          typeof safeMsg.sender === 'string'
            ? safeMsg.sender
            : {
                ...safeMsg.sender,
                email: safeMsg.sender.email ?? '',
                role: ['admin', 'editor', 'user'].includes(safeMsg.sender.role ?? '')
                  ? (safeMsg.sender.role as 'admin' | 'editor' | 'user')
                  : 'user',
              },
      };

      setMessages((prev) => [...prev, message]);
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.emit('leaveConversation', conversationId);
    };
  }, [conversationId]);

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='admin-message-viewer'>
      {messages.map((msg) => {
        const sender = msg.sender as User;
        const senderName = typeof sender === 'object' && 'name' in sender ? sender.name : 'Unknown';
        const isAdmin = typeof sender === 'object' && 'role' in sender && sender.role === 'admin';
        const timestamp = new Date(msg.createdAt).toLocaleTimeString();
        const contentHTML = DOMPurify.sanitize(marked.parse(msg.text) as string);

        return (
          <div key={msg._id} className={`admin-message ${isAdmin ? 'admin' : ''}`}>
            <strong>{senderName}</strong> <em>({timestamp})</em>:
            <div dangerouslySetInnerHTML={{ __html: contentHTML }} />
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default AdminMessageViewer;
