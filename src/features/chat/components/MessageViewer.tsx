// src/features/chat/components/MessageViewer.tsx

import { useEffect, useRef, useState } from 'react';
import api from '../../../shared/utils/axios';
import { useAuth } from '../../../shared/hooks/useAuth';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { io } from 'socket.io-client';
import { ChatMessage } from '../../../shared/types/ChatMessage';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
  withCredentials: true,
});

const MessageViewer = ({ conversationId }: { conversationId: string }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${conversationId}`);
        setMessages(res.data);
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
    const handleNewMessage = (msg: any) => {
      if (msg.conversation === conversationId || msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on('newMessage', handleNewMessage);
    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.emit('leaveConversation', conversationId);
    };
  }, [conversationId]);

  if (loading) return <p>Loading messages...</p>;

  return (
    <div className='chat-message-viewer'>
      {messages.map((msg) => {
        const isSelf =
          typeof msg.sender === 'string'
            ? msg.sender === user?._id
            : (msg.sender as any)?._id === user?._id;
        const timestamp = new Date(msg.createdAt).toLocaleTimeString();
        const contentHTML = DOMPurify.sanitize(marked.parse(msg.text) as string);

        return (
          <div key={msg._id} className={`chat-message ${isSelf ? 'self' : ''}`}>
            <strong>
              {isSelf
                ? 'You'
                : typeof msg.sender === 'object' && 'name' in msg.sender
                ? msg.sender.name
                : 'User'}
            </strong>
            <em>({timestamp})</em>:
            <div dangerouslySetInnerHTML={{ __html: contentHTML }} />
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageViewer;
