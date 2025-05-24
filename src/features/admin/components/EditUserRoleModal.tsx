// src/features/admin/components/EditUserRoleModal.tsx

import { useState } from 'react';
import api from '../../../shared/utils/axios';
import { toast } from 'react-hot-toast';

interface Props {
  userId: string;
  currentRole: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const ROLES = ['user', 'editor', 'admin'] as const;

const EditUserRoleModal = ({ userId, currentRole, isOpen, onClose, onUpdated }: Props) => {
  const [role, setRole] = useState(currentRole);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.patch(`/users/${userId}/role`, { role });
      toast.success('Role updated');
      onUpdated();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Update failed');
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='modal'>
      <div className='modal__overlay' onClick={onClose} />
      <div className='modal__content'>
        <h3>Edit User Role</h3>
        {error && <div className='modal__error'>{error}</div>}
        <form onSubmit={handleSave}>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
          <div className='modal__actions'>
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

export default EditUserRoleModal;
