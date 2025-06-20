// /src/features/chat/components/ChatWindow.tsx
import MessageViewer from './MessageViewer';
import MessageInput from './MessageInput';
import { useTranslation } from 'react-i18next';
import '../styles/ChatWindow.scss';

const ChatWindow = ({ conversationId }: { conversationId: string }) => {
  const { t } = useTranslation();

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
      <MessageViewer conversationId={conversationId} />
      <MessageInput conversationId={conversationId} />
    </div>
  );
};

export default ChatWindow;
