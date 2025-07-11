// /src/features/chat/components/MessageInput.tsx

import { useRef, useState } from 'react';
import api from '../../../shared/utils/axios';
import { useTranslation } from 'react-i18next';
import { ChatMessage } from '../../../shared/types/ChatMessage';
import { RiSendPlaneFill, RiAttachment2, RiCloseCircleFill } from 'react-icons/ri';
import '../styles/MessageInput.scss';

interface MessageInputProps {
  conversationId: string;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const MessageInput = ({ conversationId, setMessages }: MessageInputProps) => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scrolla ao fundo do chat quando o textarea recebe foco (mobile)
  const handleFocus = () => {
    setTimeout(() => {
      const messagesDiv = document.querySelector('.chat-messages');
      if (messagesDiv) {
        messagesDiv.scrollTo({ top: messagesDiv.scrollHeight, behavior: 'smooth' });
      }
    }, 100); // Espera um pouco para garantir que o teclado abriu
  };

  const handleRemoveFile = () => setFile(null);

  const handleSend = async () => {
    if (!text.trim() && !file) return;
    setSending(true);
    try {
      const formData = new FormData();
      formData.append('text', text);
      if (file) formData.append('file', file);
      const res = await api.post<ChatMessage>(`/messages/${conversationId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setText('');
      handleRemoveFile();
      textareaRef.current?.focus();
      setMessages((prev) => [...prev, res.data]);
    } catch (err) {
      alert(t('chat.input.sendError', 'Failed to send message.'));
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className='chat-input'>
      <label className='chat-input__attachment'>
        <RiAttachment2 size={22} />
        <input
          type='file'
          accept='image/*,application/pdf'
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setFile(e.target.files[0]);
            }
          }}
        />
      </label>
      {file && (
        <div className='chat-input__file'>
          <span>{file.name}</span>
          <button type='button' onClick={handleRemoveFile} className='chat-input__remove-file'>
            <RiCloseCircleFill size={20} />
          </button>
        </div>
      )}
      <textarea
        ref={textareaRef}
        className='chat-input__field'
        placeholder={t('chat.input.placeholder', 'Type a message...')}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        disabled={sending}
        rows={1}
        maxLength={1200}
      />
      <button
        className='chat-input__send'
        onClick={handleSend}
        disabled={sending || (!text.trim() && !file)}
        title={t('chat.input.send', 'Send')}>
        <RiSendPlaneFill size={26} />
      </button>
    </div>
  );
};

export default MessageInput;
