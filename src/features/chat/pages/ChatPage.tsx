// /src/features/chat/pages/ChatPage.tsx
import { useState } from 'react';
import ChatSidebar from '../components/ ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import { useTranslation } from 'react-i18next';
import '../styles/ChatPage.scss';

const ChatPage = () => {
  const [conversationId, setConversationId] = useState<string>('');
  const { t } = useTranslation();

  return (
    <div className='chat-page'>
      <ChatSidebar onSelect={setConversationId} />
      <ChatWindow conversationId={conversationId} />
    </div>
  );
};

export default ChatPage;
