// /src/features/chat/components/MessageViewer.tsx

import { useEffect, useRef, useState } from 'react';
import api from '../../../shared/utils/axios';
import { useAuth } from '../../../shared/hooks/useAuth';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';
import { ChatMessage } from '../../../shared/types/ChatMessage';
import { RiErrorWarningLine, RiFilePdf2Line, RiDownloadLine, RiImage2Line } from 'react-icons/ri';
import '../styles/MessageViewer.scss';

const MessageViewer = ({ conversationId }: { conversationId: string }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [lightbox, setLightbox] = useState<{ url: string; alt: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    api
      .get(`/messages/${conversationId}`)
      .then((res) => mounted && setMessages(res.data))
      .catch(() => mounted && setError(t('chat.messagelist.error', 'Failed to load messages')))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [conversationId, t]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading)
    return (
      <div className='chat-messages__loading'>
        <div className='skeleton skeleton--bubble' />
        <div className='skeleton skeleton--bubble' />
        <div className='skeleton skeleton--bubble' />
      </div>
    );
  if (error)
    return (
      <div className='chat-messages__error'>
        <RiErrorWarningLine size={40} color='#ef5959' />
        <div>{error}</div>
      </div>
    );
  if (messages.length === 0)
    return (
      <div className='chat-messages__empty'>
        <svg width='50' height='50' viewBox='0 0 24 24' fill='#c8d5f7'>
          <path d='M21 2H3a1 1 0 00-1 1v18l4-4h15a1 1 0 001-1V3a1 1 0 00-1-1zm-2 12H7v-2h12v2zm0-4H7V8h12v2zm-4-4v2H7V6h8z'></path>
        </svg>
        <div>{t('chat.messagelist.empty', 'No messages yet')}</div>
      </div>
    );

  return (
    <div className='chat-messages'>
      {messages.map((msg) => {
        const isSelf =
          typeof msg.sender === 'string'
            ? msg.sender === user?._id
            : (msg.sender as any)?._id === user?._id;
        const time = new Date(msg.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        const contentHTML = DOMPurify.sanitize(marked.parse(msg.text) as string);

        // Show attachment if exists
        let attachment = null;
        if (msg.fileUrl && msg.fileType) {
          if (msg.fileType.startsWith('image/')) {
            attachment = (
              <div className='chat-message__attachment chat-message__attachment--img'>
                <button
                  className='chat-message__imgbtn'
                  title={t('chat.attachment.openImg', 'Open image')}
                  onClick={() => setLightbox({ url: msg.fileUrl!, alt: msg.fileName || 'Image' })}
                  type='button'
                  aria-label={t('chat.attachment.openImg', 'Open image')}>
                  <img src={msg.fileUrl} alt={msg.fileName || 'attachment'} />
                  <RiImage2Line size={18} className='chat-message__imgicon' />
                </button>
              </div>
            );
          } else if (msg.fileType === 'application/pdf') {
            attachment = (
              <div className='chat-message__attachment chat-message__attachment--pdf'>
                <RiFilePdf2Line size={32} />
                <span className='chat-message__pdfname'>{msg.fileName || 'PDF file'}</span>
                <a
                  href={msg.fileUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  download={msg.fileName}
                  className='chat-message__pdfdownload'
                  title={t('chat.attachment.download', 'Download PDF')}
                  aria-label={t('chat.attachment.download', 'Download PDF')}>
                  <RiDownloadLine size={22} />
                </a>
              </div>
            );
          }
        }

        return (
          <div
            key={msg._id}
            className={`chat-message${isSelf ? ' chat-message--self' : ''}`}
            tabIndex={0}>
            <div className='chat-message__bubble'>
              <div
                className='chat-message__content'
                dangerouslySetInnerHTML={{ __html: contentHTML }}
              />
              {attachment}
              <span className='chat-message__meta'>
                {isSelf
                  ? t('chat.messagelist.you', 'You')
                  : typeof msg.sender === 'object' && 'name' in msg.sender
                  ? msg.sender.name
                  : 'User'}
                {' • '}
                {time}
              </span>
            </div>
          </div>
        );
      })}
      {/* Simple image lightbox */}
      {lightbox && (
        <div className='chat-lightbox' onClick={() => setLightbox(null)} tabIndex={-1}>
          <img src={lightbox.url} alt={lightbox.alt} className='chat-lightbox__img' />
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageViewer;
