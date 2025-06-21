// src/features/chat/components/ChatSidebar.tsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../shared/utils/axios';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { RiHome2Line, RiSearch2Line, RiAddFill } from 'react-icons/ri';
import { getAvatar } from '../../../shared/utils/getAvatar';
import '../styles/ChatSidebar.scss';

interface Conversation {
  _id: string;
  participants: { _id: string; name: string; avatar?: string }[];
  lastMessage?: { text: string; createdAt: string };
  unreadCount?: number;
}

interface ChatSidebarProps {
  onSelect: (id: string) => void;
}

const ChatSidebar = ({ onSelect }: ChatSidebarProps) => {
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
        // DEBUG: console.log('DEBUG conversations:', res.data);
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

  const filtered = conversations.filter((conv) => {
    const other = conv.participants.find((p) => p._id !== user?._id);
    return other?.name?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <aside className='chat-sidebar'>
      {/* Sidebar Header */}
      <div className='chat-sidebar__header'>
        <span className='chat-sidebar__avatar'>
          <img src={getAvatar(user || undefined)} alt='User avatar' />
        </span>
        <span className='chat-sidebar__title'>{t('chat.sidebar.title', 'Chats')}</span>
        <button className='chat-sidebar__add-btn' title='New chat'>
          <RiAddFill size={28} />
        </button>
      </div>

      {/* Search Input */}
      <div className='chat-sidebar__search'>
        <span className='chat-sidebar__search-icon'>
          <RiSearch2Line size={18} />
        </span>
        <input
          type='text'
          className='chat-sidebar__search-input'
          placeholder={t('chat.sidebar.search', 'Search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label={t('chat.sidebar.search', 'Search')}
        />
      </div>

      {/* Chat List */}
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
            <span>No chats found</span>
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
              <img src={getAvatar(other)} alt={other?.name} className='chat-sidebar__item-avatar' />
              <div className='chat-sidebar__item-main'>
                <div className='chat-sidebar__item-top'>
                  <span className='chat-sidebar__item-name'>{other?.name || 'Unknown'}</span>
                  {conv.lastMessage?.createdAt && (
                    <span className='chat-sidebar__item-time'>
                      {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>
                <div className='chat-sidebar__item-bottom'>
                  <span className='chat-sidebar__item-last'>
                    {conv.lastMessage?.text?.slice(0, 36) || 'No messages'}
                  </span>
                  {conv.unreadCount ? (
                    <span className='chat-sidebar__item-unread'>
                      {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                    </span>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Neon Home Button */}
      <div className='chat-sidebar__footer'>
        <Link to='/' className='chat-sidebar__footer-home' title='Home'>
          <RiHome2Line size={28} />
        </Link>
      </div>
    </aside>
  );
};

export default ChatSidebar;
