// The-Human-Tech-Blog-React/src/shared/components/ConfirmDialog.tsx

import './ConfirmDialog.scss';
import { ReactNode } from 'react';

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  icon?: ReactNode;
}

const ConfirmDialog = ({
  message,
  onConfirm,
  onCancel,
  confirmText = 'Yes',
  cancelText = 'Cancel',
  icon,
}: ConfirmDialogProps) => {
  return (
    <div className='confirm-dialog'>
      <div className='confirm-dialog__backdrop' onClick={onCancel} />
      <div className='confirm-dialog__content'>
        {icon && <div className='confirm-dialog__icon'>{icon}</div>}
        <p className='confirm-dialog__message'>{message}</p>
        <div className='confirm-dialog__actions'>
          <button className='confirm-dialog__btn confirm-dialog__btn--confirm' onClick={onConfirm}>
            {confirmText}
          </button>
          <button className='confirm-dialog__btn confirm-dialog__btn--cancel' onClick={onCancel}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
