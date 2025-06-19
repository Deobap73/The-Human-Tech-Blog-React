// The-Human-Tech-Blog-React/src/features/chat/components/MessageInput.tsx

import { useState } from 'react';
import { useSocketContext } from '../../../shared/context/SocketContext';
import { useTranslation } from 'react-i18next';

const MessageInput = ({ conversationId }: { conversationId: string }) => {
  const [text, setText] = useState('');
  const { sendMessage } = useSocketContext();
  const { t } = useTranslation();

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(conversationId, text);
    setText('');
  };

  return (
    <div className='chat-message-input'>
      <input
        type='text'
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('chat.inputPlaceholder')}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSend();
        }}
      />
      <button onClick={handleSend}>{t('chat.send')}</button>
    </div>
  );
};

export default MessageInput;
