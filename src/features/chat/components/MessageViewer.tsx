// /src/features/chat/components/MessageViewer.tsx
import { useEffect, useRef, useState } from 'react';
import api from '../../../shared/utils/axios';
import { useAuth } from '../../../shared/hooks/useAuth';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';
import { ChatMessage } from '../../../shared/types/ChatMessage';
import { RiErrorWarningLine } from 'react-icons/ri';
import '../styles/MessageViewer.scss';
const MessageViewer = ({ conversationId }: { conversationId: string }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    api
      .get(`/messages/${conversationId}`)
      .then((res) => mounted && setMessages(res.data))
      .catch(() => mounted && setError(t('chat.messagelist.error', 'Failed to load messages')))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [conversationId, t]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading)
    return (
      <div className='chat-messages__loading'>
        <div className='skeleton skeleton--bubble' />
        <div className='skeleton skeleton--bubble' />
        <div className='skeleton skeleton--bubble' />
      </div>
    );
  if (error)
    return (
      <div className='chat-messages__error'>
        <RiErrorWarningLine size={40} color='#ef5959' />
        <div>{error}</div>
      </div>
    );
  if (messages.length === 0)
    return (
      <div className='chat-messages__empty'>
        <svg width='50' height='50' viewBox='0 0 24 24' fill='#c8d5f7'>
          <path d='M21 2H3a1 1 0 00-1 1v18l4-4h15a1 1 0 001-1V3a1 1 0 00-1-1zm-2 12H7v-2h12v2zm0-4H7V8h12v2zm-4-4v2H7V6h8z'></path>
        </svg>
        <div>{t('chat.messagelist.empty', 'No messages yet')}</div>
      </div>
    );

  return (
    <div className='chat-messages'>
      {messages.map((msg) => {
        const isSelf =
          typeof msg.sender === 'string'
            ? msg.sender === user?._id
            : (msg.sender as any)?._id === user?._id;
        const time = new Date(msg.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        const contentHTML = DOMPurify.sanitize(marked.parse(msg.text) as string);
        return (
          <div
            key={msg._id}
            className={`chat-message${isSelf ? ' chat-message--self' : ''}`}
            tabIndex={0}>
            <div className='chat-message__bubble'>
              <div
                className='chat-message__content'
                dangerouslySetInnerHTML={{ __html: contentHTML }}
              />
              <span className='chat-message__meta'>
                {isSelf
                  ? t('chat.messagelist.you', 'You')
                  : typeof msg.sender === 'object' && 'name' in msg.sender
                  ? msg.sender.name
                  : 'User'}
                {' • '}
                {time}
              </span>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageViewer;
