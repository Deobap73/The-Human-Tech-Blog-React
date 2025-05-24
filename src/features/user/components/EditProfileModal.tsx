// src/features/user/components/EditProfileModal.tsx

import { useState } from 'react';
import api from '../../../shared/utils/axios';
import { useAuth } from '../../../shared/hooks/useAuth';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void; // callback to refresh user info
}

const EditProfileModal = ({ isOpen, onClose, onUpdate }: Props) => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Reset fields on open
  if (isOpen && !saving && user) {
    if (name !== user.name) setName(user.name);
    if (email !== user.email) setEmail(user.email);
    if (avatar !== user.avatar) setAvatar(user.avatar || '');
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await api.patch('/users/me', { name, email, avatar });
      setUser(res.data.user);
      onUpdate();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='edit-profile-modal'>
      <div className='edit-profile-modal__overlay' onClick={onClose} />
      <div className='edit-profile-modal__content'>
        <h3>Edit Profile</h3>
        {error && <div className='edit-profile-modal__error'>{error}</div>}
        <form onSubmit={handleSave}>
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
          </label>
          <label>
            Email
            <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Avatar URL
            <input value={avatar} onChange={(e) => setAvatar(e.target.value)} />
          </label>
          <div className='edit-profile-modal__actions'>
            <button type='button' onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type='submit' disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
