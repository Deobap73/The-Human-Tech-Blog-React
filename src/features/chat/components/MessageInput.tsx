// src/features/chat/components/MessageInput.tsx

import { useRef, useState } from 'react';
import api from '../../../shared/utils/axios';
import { useTranslation } from 'react-i18next';
import { RiSendPlane2Line, RiAttachment2, RiMicLine, RiCloseLine } from 'react-icons/ri';
import '../styles/MessageInput.scss';

interface PreviewFile {
  url: string;
  name: string;
  type: string;
}

const MAX_FILE_SIZE_MB = 5;

const MessageInput = ({ conversationId }: { conversationId: string }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewFile | null>(null);
  const [sending, setSending] = useState(false);
  const { t } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle file selection (image or PDF)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!(selected.type.startsWith('image/') || selected.type === 'application/pdf')) {
      alert('Only images or PDFs are allowed.');
      return;
    }
    if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert('Max file size is 5MB.');
      return;
    }
    setFile(selected);
    // Preview for images
    if (selected.type.startsWith('image/')) {
      setPreview({
        url: URL.createObjectURL(selected),
        name: selected.name,
        type: selected.type,
      });
    } else {
      // For PDF, just show file name
      setPreview({
        url: '',
        name: selected.name,
        type: selected.type,
      });
    }
  };

  // Remove file
  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Send message (text and/or file)
  const handleSend = async () => {
    if (!text.trim() && !file) return;
    setSending(true);
    try {
      const formData = new FormData();
      formData.append('text', text);
      if (file) formData.append('file', file);
      await api.post(`/messages/${conversationId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setText('');
      handleRemoveFile();
      textareaRef.current?.focus();
      // Socket/context update in real app
    } catch (err) {
      alert('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  // Enter = send; Shift+Enter = newline
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Else allow native new line
  };

  return (
    <div className='chat-input'>
      {/* Attach file */}
      <button
        className='chat-input__icon'
        title={t('chat.input.attach', 'Attach')}
        type='button'
        onClick={() => fileInputRef.current?.click()}
        aria-label={t('chat.input.attach', 'Attach')}
        disabled={sending}>
        <RiAttachment2 size={22} />
        <input
          type='file'
          accept='image/*,application/pdf'
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </button>

      {/* File preview */}
      {preview && (
        <div className='chat-input__preview'>
          {preview.type.startsWith('image/') ? (
            <img src={preview.url} alt={preview.name} className='chat-input__preview-img' />
          ) : (
            <span className='chat-input__preview-pdf'>
              <span className='chat-input__preview-pdficon'>PDF</span>
              {preview.name}
            </span>
          )}
          <button
            className='chat-input__preview-remove'
            onClick={handleRemoveFile}
            title={t('chat.input.remove', 'Remove')}
            type='button'
            aria-label={t('chat.input.remove', 'Remove')}>
            <RiCloseLine size={18} />
          </button>
        </div>
      )}

      {/* Multiline textarea */}
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
        style={{
          resize: 'none',
          overflowY: 'auto',
          minHeight: '36px',
          maxHeight: '148px',
        }}
        disabled={sending}
      />
      <button
        className='chat-input__icon'
        title={t('chat.input.mic', 'Record audio')}
        type='button'
        disabled>
        <RiMicLine size={22} />
      </button>
      <button
        className='chat-input__send'
        onClick={handleSend}
        title={t('chat.input.send', 'Send')}
        type='button'
        tabIndex={0}
        disabled={sending}>
        <RiSendPlane2Line size={24} />
      </button>
    </div>
  );
};

export default MessageInput;
