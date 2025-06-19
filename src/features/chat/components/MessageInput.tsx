// src/features/chat/components/MessageInput.tsx

import { useState } from 'react';
import api from '../../../shared/utils/axios';
import { useTranslation } from 'react-i18next';
import { RiSendPlane2Line, RiAttachment2, RiMicLine } from 'react-icons/ri';

const MessageInput = ({ conversationId }: { conversationId: string }) => {
  const [text, setText] = useState('');
  const { t } = useTranslation();

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      await api.post(`/messages/${conversationId}`, { text });
      setText('');
      // trigger refetch (pode usar context/socket na versão real)
    } catch (err) {
      // Optionally add feedback (toast)
    }
  };

  return (
    <div className='chat-input'>
      <button className='chat-input__icon' title={t('chat.input.attach', 'Attach')}>
        <RiAttachment2 size={22} />
      </button>
      <input
        type='text'
        className='chat-input__field'
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('chat.input.placeholder', 'Type your message…')}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSend();
        }}
        aria-label={t('chat.input.placeholder', 'Type your message…')}
      />
      <button className='chat-input__icon' title={t('chat.input.mic', 'Record audio')}>
        <RiMicLine size={22} />
      </button>
      <button
        className='chat-input__send'
        onClick={handleSend}
        title={t('chat.input.send', 'Send')}>
        <RiSendPlane2Line size={24} />
      </button>
    </div>
  );
};

export default MessageInput;
