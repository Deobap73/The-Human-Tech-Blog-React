// /src/features/chat/components/ChatWindow.tsx

import { useNavigate } from 'react-router-dom';
import MessageViewer from './MessageViewer';
import MessageInput from './MessageInput';
import { useTranslation } from 'react-i18next';
import { RiArrowLeftSLine } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import pencilImg from '../../../assets/blackPencil.webp';
import '../styles/ChatWindow.scss';

// Helper: Detecta se é mobile/tablet
function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);
  return isMobile;
}

const ChatWindow = ({ conversationId }: { conversationId: string }) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Mostra "voltar" só em mobile/tablet e quando há conversa selecionada
  const showBack = isMobile && conversationId;

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
      {/* Pencil overlay */}
      <div className='chat-window__pencil'>
        <img src={pencilImg} alt='Black pencil decorative' draggable='false' />
      </div>
      {/* Header customizável — botão voltar só mobile */}
      {showBack && (
        <div className='chat-window__header chat-window__header--mobile'>
          <button
            className='chat-window__header-back'
            onClick={() => navigate(-1)}
            aria-label={t('chat.window.back', 'Back')}
            type='button'>
            <RiArrowLeftSLine />
          </button>
          {/* Placeholder para nome do chat (adapta se tiveres username ou avatar) */}
          <span className='chat-window__header-mobile-title'>{t('chat.window.chat', 'Chat')}</span>
        </div>
      )}
      <MessageViewer conversationId={conversationId} />
      <MessageInput conversationId={conversationId} />
    </div>
  );
};

export default ChatWindow;
