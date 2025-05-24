// src/features/user/components/UserProfileInfo.tsx

import { useAuth } from '../../../shared/hooks/useAuth';
import EditProfileModal from './EditProfileModal';
import { useState } from 'react';

const UserProfileInfo = () => {
  const { user, logout } = useAuth();
  const [editOpen, setEditOpen] = useState(false);

  if (!user) return null;

  return (
    <section className='user-page__profile'>
      <div className='user-page__avatar'>
        <img
          src={user.avatar || `https://api.dicebear.com/8.x/pixel-art/svg?seed=${user._id}`}
          alt={user.name}
          width={80}
          height={80}
        />
      </div>
      <div className='user-page__info'>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <button onClick={() => setEditOpen(true)}>Edit Profile</button>
        <button className='user-page__logout-btn' onClick={logout}>
          Logout
        </button>
      </div>
      {/* Modal só aparece se editOpen for true */}
      <EditProfileModal isOpen={editOpen} onClose={() => setEditOpen(false)} onUpdate={() => {}} />
    </section>
  );
};

export default UserProfileInfo;
