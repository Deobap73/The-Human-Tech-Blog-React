// /src/features/chat/components/ChatWindow.tsx

import { useEffect, useState } from 'react';
import MessageViewer from './MessageViewer';
import MessageInput from './MessageInput';
import { useTranslation } from 'react-i18next';
import { RiArrowLeftSLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import pencilImg from '../../../assets/blackPencil.webp';
import { ChatMessage } from '../../../shared/types/ChatMessage';
import api from '../../../shared/utils/axios';
import '../styles/ChatWindow.scss';

// Responsive detection for tablet/mobile (1024px)
function useIsTablet(breakpoint = 1024) {
  const [isTablet, setIsTablet] = useState(window.innerWidth <= breakpoint);
  useEffect(() => {
    const handleResize = () => setIsTablet(window.innerWidth <= breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);
  return isTablet;
}

const ChatWindow = ({ conversationId }: { conversationId: string }) => {
  const { t } = useTranslation();
  const isTablet = useIsTablet();
  const navigate = useNavigate();

  // Centralize message state here!
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Load messages on mount or when conversationId changes
  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);
    api
      .get(`/messages/${conversationId}`)
      .then((res) => setMessages(res.data))
      .finally(() => setLoading(false));
  }, [conversationId]);

  // Show "back" only on tablet/mobile and when a conversation is selected
  const showBack = isTablet && conversationId;

  if (!conversationId) {
    return (
      <div className='chat-window chat-window--empty'>
        <div className='chat-window__empty-icon' aria-hidden>
          <svg width='60' height='60' viewBox='0 0 24 24' fill='#1da1f2'>
            <path d='M21 2H3a1 1 0 00-1 1v18l4-4h15a1 1 0 001-1V3a1 1 0 00-1-1zm-2 12H7v-2h12v2zm0-4H7V8h12v2zm-4-4v2H7V6h8z'></path>
          </svg>
        </div>
        <div className='chat-window__empty-title'>
          {t('chat.window.emptyTitle', 'Select a conversation')}
        </div>
        <div className='chat-window__empty-desc'>
          {t('chat.window.emptyDesc', 'Choose a chat to start messaging.')}
        </div>
      </div>
    );
  }

  return (
    <div className='chat-window'>
      {/* Pencil overlay (hide on tablet/mobile) */}
      {!isTablet && (
        <div className='chat-window__pencil'>
          <img src={pencilImg} alt='Black pencil decorative' draggable='false' loading='lazy' />
        </div>
      )}
      {showBack && (
        <div className='chat-window__header chat-window__header--mobile'>
          <button
            className='chat-window__header-back'
            onClick={() => navigate(-1)}
            aria-label={t('chat.window.back', 'Back')}
            type='button'>
            <RiArrowLeftSLine />
          </button>
          <span className='chat-window__header-mobile-title'>{t('chat.window.chat', 'Chat')}</span>
        </div>
      )}
      <MessageViewer
        conversationId={conversationId}
        messages={messages}
        setMessages={setMessages}
        loading={loading}
      />
      <MessageInput conversationId={conversationId} setMessages={setMessages} />
    </div>
  );
};

export default ChatWindow;
