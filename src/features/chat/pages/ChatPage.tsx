// The-Human-Tech-Blog-React/src/features/chat/pages/ChatPage.tsx

import { useState } from 'react';
import ChatSidebar from '../components/ ChatSidebar';
import ChatWindow from '../components/ChatWindow';

const ChatPage = () => {
  const [conversationId, setConversationId] = useState<string>('');
  return (
    <div className='chat-page' style={{ display: 'flex', gap: '1rem' }}>
      <ChatSidebar onSelect={setConversationId} />
      {conversationId ? (
        <ChatWindow conversationId={conversationId} />
      ) : (
        <div className='chat-placeholder'>Select a conversation</div>
      )}
    </div>
  );
};

export default ChatPage;
