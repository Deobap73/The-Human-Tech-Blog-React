// src/features/user/components/UserProfileInfo.tsx

import { useAuth } from '../../../shared/hooks/useAuth';
import EditProfileModal from './EditProfileModal';
import { useState } from 'react';
import '../styles/UserProfileInfo.scss';

const UserProfileInfo = () => {
  const { user, logout } = useAuth();
  const [editOpen, setEditOpen] = useState(false);

  if (!user) return null;

  return (
    <div className='user-profile'>
      <div className='user-profile__avatar'>
        <img
          src={user.avatar || `https://api.dicebear.com/8.x/pixel-art/svg?seed=${user._id}`}
          alt={user.name}
          width={88}
          height={88}
        />
      </div>
      <div className='user-profile__info'>
        <h2 className='user-profile__name'>{user.name}</h2>
        <div className='user-profile__email'>{user.email}</div>
        <div className='user-profile__actions'>
          <button className='user-profile__edit-btn' onClick={() => setEditOpen(true)}>
            Edit Profile
          </button>
          <button className='user-profile__logout-btn' onClick={logout}>
            Logout
          </button>
        </div>
      </div>
      <EditProfileModal isOpen={editOpen} onClose={() => setEditOpen(false)} onUpdate={() => {}} />
    </div>
  );
};

export default UserProfileInfo;
