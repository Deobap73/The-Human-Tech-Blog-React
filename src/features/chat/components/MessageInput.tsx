// The-Human-Tech-Blog-React/src/features/chat/components/MessageInput.tsx

import { useState } from 'react';
import api from '../../../shared/utils/axios';

const MessageInput = ({ conversationId }: { conversationId: string }) => {
  const [text, setText] = useState('');

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      await api.post(`/messages/${conversationId}`, { text });
      setText('');
    } catch (err) {
      // Optionally add feedback (toast)
    }
  };

  return (
    <div className='chat-message-input'>
      <input
        type='text'
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Type your message...'
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSend();
        }}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default MessageInput;
