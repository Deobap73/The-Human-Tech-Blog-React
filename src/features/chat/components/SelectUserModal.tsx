// /src/features/chat/components/SelectUserModal.tsx
import { useEffect, useState, useCallback, useRef } from 'react';
import { UserSummary, fetchUsers } from '../../../shared/services/userService';
import { getAvatar } from '../../../shared/utils/getAvatar';
import toast from 'react-hot-toast';
import '../styles/SelectUserModal.scss';

interface SelectUserModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (user: UserSummary) => Promise<void>;
  currentUserId: string;
  currentUserRole: string;
}

const SelectUserModal = ({
  open,
  onClose,
  onSelect,
  currentUserId,
  currentUserRole,
}: SelectUserModalProps) => {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingSelect, setLoadingSelect] = useState<string | null>(null); // userId que está loading
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [inlineError, setInlineError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setLoadingUsers(true);
    setError('');
    setInlineError('');
    fetchUsers()
      .then((data) => setUsers(data))
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoadingUsers(false));
  }, [open]);

  // ESC support
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  // Autofocus modal content
  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }
  }, [open]);

  // Filter users: admins for user, all except self for admin
  const filteredUsers = users
    .filter((user) => user._id !== currentUserId)
    .filter((user) => (currentUserRole === 'admin' ? true : user.role === 'admin'))
    .filter((user) => user.name.toLowerCase().includes(search.toLowerCase()));

  // Seleciona utilizador e trata feedback
  const handleSelect = useCallback(
    async (user: UserSummary) => {
      setLoadingSelect(user._id);
      setInlineError('');
      try {
        await onSelect(user); // onSelect faz toda a lógica (inclui toast/redirect)
        setLoadingSelect(null);
      } catch (err: any) {
        setInlineError(err?.message || 'Could not create conversation.');
        setLoadingSelect(null);
      }
    },
    [onSelect]
  );

  if (!open) return null;

  return (
    <div className='select-user-modal'>
      <div className='select-user-modal__backdrop' onClick={onClose} />
      <div className='select-user-modal__content' tabIndex={-1} ref={modalRef}>
        <h2 className='select-user-modal__title'>Select user to chat</h2>
        <input
          className='select-user-modal__search'
          type='text'
          placeholder='Search user...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className='select-user-modal__close' onClick={onClose} title='Close modal'>
          ×
        </button>
        {loadingUsers ? (
          <div className='select-user-modal__loading'>Loading users...</div>
        ) : error ? (
          <div className='select-user-modal__error'>{error}</div>
        ) : (
          <ul className='select-user-modal__list'>
            {filteredUsers.length === 0 && (
              <li className='select-user-modal__empty'>No users found</li>
            )}
            {filteredUsers.map((user) => (
              <li
                key={user._id}
                className='select-user-modal__item'
                tabIndex={0}
                aria-disabled={!!loadingSelect}
                onClick={() => !loadingSelect && handleSelect(user)}
                onKeyDown={(e) => !loadingSelect && e.key === 'Enter' && handleSelect(user)}>
                <img src={getAvatar(user)} alt={user.name} className='select-user-modal__avatar' />
                <span className='select-user-modal__name'>{user.name}</span>
                <span className='select-user-modal__role'>{user.role}</span>
                <button
                  className='select-user-modal__select-btn'
                  disabled={loadingSelect === user._id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(user);
                  }}>
                  {loadingSelect === user._id ? 'Selecting...' : 'Select'}
                </button>
              </li>
            ))}
          </ul>
        )}
        {inlineError && (
          <div className='select-user-modal__error' style={{ marginTop: 10 }}>
            {inlineError}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectUserModal;
