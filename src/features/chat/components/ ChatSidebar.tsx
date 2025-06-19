// /src/features/chat/components/ChatSidebar.tsx

import { useEffect, useState } from 'react';
import api from '../../../shared/utils/axios';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import {
  RiAttachment2,
  RiCameraLine,
  RiSettings3Line,
  RiAddLine,
  RiChatSmile2Line,
  RiSearch2Line,
} from 'react-icons/ri';

interface Conversation {
  _id: string;
  participants: { _id: string; name: string; avatar?: string }[];
  lastMessage?: { text: string; createdAt: string };
  unreadCount?: number;
}

interface ChatSidebarProps {
  onSelect: (id: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const ChatSidebar = ({ onSelect, isOpen = true, onClose }: ChatSidebarProps) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchConversations = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/conversations');
        if (mounted) setConversations(res.data);
      } catch {
        if (mounted) setError(t('chat.sidebar.error', 'Failed to load chats'));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchConversations();
    return () => {
      mounted = false;
    };
  }, [t]);

  // Filter conversations by search term (case-insensitive)
  const filtered = conversations.filter((conv) => {
    const other = conv.participants.find((p) => p._id !== user?._id);
    return other?.name?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      {/* Overlay for mobile drawer */}
      {isOpen && onClose && <div className='chat-sidebar__overlay' onClick={onClose} aria-hidden />}
      <aside className={`chat-sidebar${isOpen ? ' chat-sidebar--open' : ''}`}>
        <div className='chat-sidebar__header'>
          <span className='chat-sidebar__title'>
            <RiChatSmile2Line size={22} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            {t('chat.sidebar.title', 'Chats')}
          </span>
          {/* Drawer close for mobile */}
          {onClose && (
            <button
              className='chat-sidebar__close'
              onClick={onClose}
              aria-label={t('chat.sidebar.close', 'Close sidebar')}>
              <svg width='28' height='28' viewBox='0 0 24 24'>
                <path
                  fill='#1da1f2'
                  d='M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 0 0-1.41 1.41L10.59 12l-4.89 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z'
                />
              </svg>
            </button>
          )}
        </div>
        <div className='chat-sidebar__search'>
          <RiSearch2Line className='chat-sidebar__search-icon' size={18} aria-hidden />
          <input
            type='text'
            className='chat-sidebar__search-input'
            placeholder={t('chat.sidebar.search', 'Search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={t('chat.sidebar.search', 'Search')}
          />
        </div>
        <ul className='chat-sidebar__list'>
          {loading && (
            <li className='chat-sidebar__loading'>
              <span
                className='skeleton skeleton--circle'
                style={{ width: 32, height: 32, marginRight: 12 }}
              />
              <span className='skeleton' style={{ width: '60%', height: 18 }} />
            </li>
          )}
          {error && (
            <li className='chat-sidebar__error'>
              <span>{error}</span>
            </li>
          )}
          {!loading && !error && filtered.length === 0 && (
            <li className='chat-sidebar__empty'>
              <RiChatSmile2Line size={30} color='#c8d5f7' style={{ marginBottom: 4 }} />
              <span>{t('chat.sidebar.empty', 'No chats found')}</span>
            </li>
          )}
          {filtered.map((conv) => {
            const other = conv.participants.find((p) => p._id !== user?._id);
            return (
              <li
                className='chat-sidebar__item'
                key={conv._id}
                onClick={() => onSelect(conv._id)}
                tabIndex={0}>
                <img
                  src={other?.avatar || '/images/1.jpg'}
                  alt={other?.name}
                  className='chat-sidebar__item-avatar'
                />
                <div className='chat-sidebar__item-info'>
                  <span className='chat-sidebar__item-name'>{other?.name || 'Unknown'}</span>
                  <span className='chat-sidebar__item-last'>
                    {conv.lastMessage?.text?.slice(0, 38) ||
                      t('chat.sidebar.noMessage', 'No messages')}
                  </span>
                </div>
                {/* Unread badge */}
                {conv.unreadCount ? (
                  <span className='chat-sidebar__item-unread'>
                    {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                  </span>
                ) : null}
                {/* Time of last message */}
                {conv.lastMessage?.createdAt && (
                  <span className='chat-sidebar__item-time'>
                    {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        <div className='chat-sidebar__footer'>
          <button
            className='chat-sidebar__footer-button'
            title={t('chat.sidebar.attach', 'Attach')}>
            <RiAttachment2 size={22} />
          </button>
          <button
            className='chat-sidebar__footer-button'
            title={t('chat.sidebar.camera', 'Camera')}>
            <RiCameraLine size={22} />
          </button>
          <button
            className='chat-sidebar__footer-button'
            title={t('chat.sidebar.settings', 'Settings')}>
            <RiSettings3Line size={22} />
          </button>
          <button className='chat-sidebar__footer-button' title={t('chat.sidebar.add', 'Add Chat')}>
            <RiAddLine size={22} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default ChatSidebar;
