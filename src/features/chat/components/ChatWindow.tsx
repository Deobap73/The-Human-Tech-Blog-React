// The-Human-Tech-Blog-React/src/features/chat/components/ChatWindow.tsx

import MessageViewer from './MessageViewer';
import MessageInput from './MessageInput';

const ChatWindow = ({ conversationId }: { conversationId: string }) => (
  <div className='chat-window'>
    <MessageViewer conversationId={conversationId} />
    <MessageInput conversationId={conversationId} />
  </div>
);

export default ChatWindow;
