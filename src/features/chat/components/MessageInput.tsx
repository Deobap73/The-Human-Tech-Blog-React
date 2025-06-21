// src/features/chat/components/MessageInput.tsx

import { useRef, useState } from 'react';
import api from '../../../shared/utils/axios';
import { useTranslation } from 'react-i18next';
import { RiSendPlane2Line, RiAttachment2, RiMicLine, RiCloseLine } from 'react-icons/ri';
import '../styles/MessageInput.scss';

const MAX_FILE_SIZE_MB = 5;

const MessageInput = ({ conversationId }: { conversationId: string }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { t } = useTranslation();

  // Trigger hidden file input on attach click
  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(selectedFile.type)) {
      setFileError('Only PNG, JPG, WEBP or PDF files are allowed.');
      setFile(null);
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFileError('Max file size is 5MB.');
      setFile(null);
      return;
    }
    setFileError('');
    setFile(selectedFile);
  };

  // Remove attached file
  const handleRemoveFile = () => {
    setFile(null);
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Send message (with or without file)
  const handleSend = async () => {
    if (!text.trim() && !file) return;
    try {
      const formData = new FormData();
      if (text.trim()) formData.append('text', text.trim());
      if (file) formData.append('file', file);

      await api.post(`/messages/${conversationId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setText('');
      handleRemoveFile();
      textareaRef.current?.focus();
      // Trigger refetch/socket, etc.
    } catch (err) {
      // Optionally add feedback (toast)
    }
  };

  // Enter = send, Shift+Enter = newline
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Previsualização de imagem/pdf
  const renderFilePreview = () => {
    if (!file) return null;
    if (file.type.startsWith('image/')) {
      return (
        <div className='chat-input__preview'>
          <img src={URL.createObjectURL(file)} alt='preview' className='chat-input__preview-img' />
          <button
            type='button'
            className='chat-input__preview-remove'
            onClick={handleRemoveFile}
            aria-label={t('chat.input.remove', 'Remove attachment')}>
            <RiCloseLine size={20} />
          </button>
        </div>
      );
    }
    if (file.type === 'application/pdf') {
      return (
        <div className='chat-input__preview'>
          <span className='chat-input__preview-pdf'>{file.name}</span>
          <button
            type='button'
            className='chat-input__preview-remove'
            onClick={handleRemoveFile}
            aria-label={t('chat.input.remove', 'Remove attachment')}>
            <RiCloseLine size={20} />
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='chat-input'>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type='file'
        style={{ display: 'none' }}
        accept='image/jpeg,image/png,image/webp,application/pdf'
        onChange={handleFileChange}
        tabIndex={-1}
      />
      <button
        className='chat-input__icon'
        title={t('chat.input.attach', 'Attach')}
        type='button'
        onClick={handleAttachClick}>
        <RiAttachment2 size={22} />
      </button>
      {/* Multiline text input */}
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
      {/* File preview and error */}
      {file && renderFilePreview()}
      {fileError && <div className='chat-input__file-error'>{fileError}</div>}
    </div>
  );
};

export default MessageInput;
