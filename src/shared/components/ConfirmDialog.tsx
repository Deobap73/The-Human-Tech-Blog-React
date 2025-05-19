// src/shared/components/ConfirmDialog.tsx

import React from 'react';
import './ConfirmDialog.scss';

interface ConfirmDialogProps {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title = 'Confirm Action',
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className='confirm-dialog-backdrop'>
      <div className='confirm-dialog'>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className='confirm-dialog-buttons'>
          <button className='cancel' onClick={onCancel}>
            Cancel
          </button>
          <button className='confirm' onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
