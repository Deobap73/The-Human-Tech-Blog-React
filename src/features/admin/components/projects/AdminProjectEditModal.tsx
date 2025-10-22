// /src/features/admin/components/projects/AdminProjectEditModal.tsx
'use strict';

import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { repo?: string; figmaPublicUrl?: string; figmaFileKey?: string }) => void;
  initial?: { repo?: string; figmaPublicUrl?: string; figmaFileKey?: string };
}

/**
 * AdminProjectEditModal
 * - Minimal modal to edit repo + figma fields.
 */
const AdminProjectEditModal: React.FC<Props> = ({ isOpen, onClose, onSave, initial }) => {
  const [repo, setRepo] = useState<string>(initial?.repo ?? '');
  const [figmaUrl, setFigmaUrl] = useState<string>(initial?.figmaPublicUrl ?? '');
  const [fileKey, setFileKey] = useState<string>(initial?.figmaFileKey ?? '');

  if (!isOpen) return null;

  return (
    <div className='adminProjectEdit'>
      <div className='adminProjectEdit__overlay' onClick={onClose} aria-hidden />
      <div
        className='adminProjectEdit__modal'
        role='dialog'
        aria-modal='true'
        aria-label='Edit Project'>
        <h3 className='adminProjectEdit__title'>Edit Project Integration</h3>

        <label className='adminProjectEdit__label'>
          GitHub repo (owner/name)
          <input
            className='adminProjectEdit__input'
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder='owner/name'
          />
        </label>

        <label className='adminProjectEdit__label'>
          Figma public URL
          <input
            className='adminProjectEdit__input'
            value={figmaUrl}
            onChange={(e) => setFigmaUrl(e.target.value)}
            placeholder='https://www.figma.com/file/...'
          />
        </label>

        <label className='adminProjectEdit__label'>
          Figma file key
          <input
            className='adminProjectEdit__input'
            value={fileKey}
            onChange={(e) => setFileKey(e.target.value)}
            placeholder='FILE_KEY'
          />
        </label>

        <div className='adminProjectEdit__actions'>
          <button
            className='adminProjectEdit__btn adminProjectEdit__btn--secondary'
            onClick={onClose}>
            Cancel
          </button>
          <button
            className='adminProjectEdit__btn adminProjectEdit__btn--primary'
            onClick={() => onSave({ repo, figmaPublicUrl: figmaUrl, figmaFileKey: fileKey })}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProjectEditModal;
