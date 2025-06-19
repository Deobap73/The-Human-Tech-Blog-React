// /src/features/chat/components/MessageViewer.tsx

import { useEffect, useRef, useState } from 'react';
import api from '../../../shared/utils/axios';
import { useAuth } from '../../../shared/hooks/useAuth';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useSocketContext } from '../../../shared/context/SocketContext';
import { ChatMessage } from '../../../shared/types/ChatMessage';
import { useTranslation } from 'react-i18next';

const MessageViewer = ({ conversationId }: { conversationId: string }) => {
  const { user } = useAuth();
  const { socket, joinConversation, leaveConversation } = useSocketContext();
  const { t } = useTranslation();
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
    if (!socket) return;
    joinConversation(conversationId);
    const handleNewMessage = (msg: ChatMessage) => {
      if (
        msg.conversationId === conversationId ||
        (msg as any).conversation?._id === conversationId
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on('chat:newMessage', handleNewMessage);
    return () => {
      socket.off('chat:newMessage', handleNewMessage);
      leaveConversation(conversationId);
    };
  }, [socket, conversationId, joinConversation, leaveConversation]);

  if (loading) return <p>{t('chat.loading')}</p>;

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
          <div key={msg._id} className={`chat-message${isSelf ? ' chat-message--self' : ''}`}>
            <strong>
              {isSelf
                ? t('chat.you')
                : typeof msg.sender === 'object' && 'name' in msg.sender
                ? (msg.sender as any).name
                : t('chat.noName')}
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
