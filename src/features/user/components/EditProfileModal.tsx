// /src/features/user/components/EditProfileModal.tsx
import { useState, useEffect, ChangeEvent } from 'react';
import api from '../../../shared/utils/axios';
import { useAuth } from '../../../shared/hooks/useAuth';
import '../styles/EditProfileModal.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void; // callback to refresh user info
}

const MAX_AVATAR_SIZE_MB = 1;

const EditProfileModal = ({ isOpen, onClose, onUpdate }: Props) => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatarUrl(user.avatar || '');
      setAvatarFile(null);
      setAvatarPreview(user.avatar || '');
    }
  }, [isOpen, user]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_AVATAR_SIZE_MB * 1024 * 1024) {
      setError(`Avatar image must be less than ${MAX_AVATAR_SIZE_MB}MB`);
      setAvatarFile(null);
      setAvatarPreview(user?.avatar || '');
      return;
    }
    setError('');
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (avatarFile) {
        formData.append('avatar', avatarFile); // só se for ficheiro novo
      } else if (avatarUrl && avatarUrl !== user?.avatar) {
        // se alterou url manualmente (fallback/legacy)
        formData.append('avatar', avatarUrl);
      }

      const res = await api.patch('/users/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
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
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
            />
          </label>
          <label>
            Email
            <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Avatar
            <div className='edit-profile-modal__avatar-block'>
              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt='Avatar Preview'
                  className='edit-profile-modal__avatar-preview'
                  width={72}
                  height={72}
                />
              )}
              <input
                type='file'
                accept='image/*'
                onChange={handleAvatarChange}
                className='edit-profile-modal__avatar-input'
              />
              <span className='edit-profile-modal__avatar-hint'>(max {MAX_AVATAR_SIZE_MB}MB)</span>
            </div>
            {/* Fallback manual url (legacy, opcional) */}
            <input
              type='text'
              placeholder='Avatar URL (optional)'
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className='edit-profile-modal__avatar-url'
              style={{ marginTop: 8 }}
              disabled={!!avatarFile}
            />
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
