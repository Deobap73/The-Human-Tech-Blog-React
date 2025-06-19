// The-Human-Tech-Blog-React/src/features/chat/pages/ChatPage.tsx

import { useState } from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import { useTranslation } from 'react-i18next';

const ChatPage = () => {
  const [conversationId, setConversationId] = useState<string>('');
  const { t } = useTranslation();

  return (
    <div className='chat-page' style={{ display: 'flex', gap: '1rem' }}>
      <ChatSidebar onSelect={setConversationId} />
      {conversationId ? (
        <ChatWindow conversationId={conversationId} />
      ) : (
        <div className='chat-placeholder'>{t('chat.placeholder')}</div>
      )}
    </div>
  );
};

export default ChatPage;
