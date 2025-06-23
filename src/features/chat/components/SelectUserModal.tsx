// /src/features/chat/components/SelectUserModal.tsx
import { useEffect, useState } from 'react';
import { UserSummary, fetchUsers } from '../../../shared/services/userService';
import { getAvatar } from '../../../shared/utils/getAvatar';
import '../styles/SelectUserModal.scss';

interface SelectUserModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (user: UserSummary) => void;
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
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError('');
    fetchUsers()
      .then((data) => setUsers(data))
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false));
  }, [open]);

  // Determine which users to show (admins for normal user, all except self for admin)
  const filteredUsers = users
    .filter((user) => {
      if (user._id === currentUserId) return false;
      if (currentUserRole === 'admin') return true;
      return user.role === 'admin';
    })
    .filter((user) => user.name.toLowerCase().includes(search.toLowerCase()));

  if (!open) return null;

  return (
    <div className='select-user-modal'>
      <div className='select-user-modal__backdrop' onClick={onClose} />
      <div className='select-user-modal__content' tabIndex={-1}>
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
        {loading ? (
          <div className='select-user-modal__loading'>Loading...</div>
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
                onClick={() => onSelect(user)}
                onKeyDown={(e) => e.key === 'Enter' && onSelect(user)}>
                <img src={getAvatar(user)} alt={user.name} className='select-user-modal__avatar' />
                <span className='select-user-modal__name'>{user.name}</span>
                <span className='select-user-modal__role'>{user.role}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SelectUserModal;
