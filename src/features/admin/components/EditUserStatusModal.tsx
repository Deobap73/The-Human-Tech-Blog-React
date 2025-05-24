// src/features/admin/components/EditUserStatusModal.tsx

import { useState } from 'react';
import api from '../../../shared/utils/axios';
import { toast } from 'react-hot-toast';

interface Props {
  userId: string;
  currentStatus: boolean;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const EditUserStatusModal = ({ userId, currentStatus, isOpen, onClose, onUpdated }: Props) => {
  const [active, setActive] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.patch(`/users/${userId}/status`, { active });
      toast.success('Status updated');
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
        <h3>Edit User Status</h3>
        {error && <div className='modal__error'>{error}</div>}
        <form onSubmit={handleSave}>
          <label>
            <input type='checkbox' checked={active} onChange={(e) => setActive(e.target.checked)} />
            Active
          </label>
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

export default EditUserStatusModal;
