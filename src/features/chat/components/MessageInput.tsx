// src/features/chat/components/MessageInput.tsx

import { useRef, useState } from 'react';
import api from '../../../shared/utils/axios';
import { useTranslation } from 'react-i18next';
import { RiSendPlane2Line, RiAttachment2, RiMicLine } from 'react-icons/ri';
import '../styles/MessageInput.scss';

const MessageInput = ({ conversationId }: { conversationId: string }) => {
  const [text, setText] = useState('');
  const { t } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Handles sending message
  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      await api.post(`/messages/${conversationId}`, { text });
      setText('');
      // Focus textarea after sending
      textareaRef.current?.focus();
      // Trigger refetch with context/socket in real app
    } catch (err) {
      // Optional: show feedback (toast)
    }
  };

  // Handle keyboard: Enter = new line, Shift+Enter = send
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Shift+Enter = newline (native)
  };

  return (
    <div className='chat-input'>
      <button className='chat-input__icon' title={t('chat.input.attach', 'Attach')}>
        <RiAttachment2 size={22} />
      </button>
      <textarea
        ref={textareaRef}
        className='chat-input__field'
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('chat.input.placeholder', 'Type your message…')}
        rows={1}
        maxLength={2048}
        aria-label={t('chat.input.placeholder', 'Type your message…')}
        onKeyDown={handleKeyDown}
        // Autosize height: expand up to 7 lines, then scroll
        style={{
          resize: 'none',
          overflowY: 'auto',
          minHeight: '36px',
          maxHeight: '148px', // 7 lines aprox
        }}
      />
      <button className='chat-input__icon' title={t('chat.input.mic', 'Record audio')}>
        <RiMicLine size={22} />
      </button>
      <button
        className='chat-input__send'
        onClick={handleSend}
        title={t('chat.input.send', 'Send')}
        type='button'
        tabIndex={0}>
        <RiSendPlane2Line size={24} />
      </button>
    </div>
  );
};

export default MessageInput;
