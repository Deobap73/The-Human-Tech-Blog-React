// /src/features/admin/components/projects/AdminProjectSyncButtons.tsx
'use strict';

import React, { useState } from 'react';
import { syncFigma, syncGitHub } from '../../../../shared/services/adminProjectService';

interface Props {
  id: string;
  defaultRepo?: string;
  defaultFigmaUrl?: string;
  defaultFigmaFileKey?: string;
  onDone?: () => void;
}

/**
 * AdminProjectSyncButtons
 * - Small controls to trigger sync per row.
 */
const AdminProjectSyncButtons: React.FC<Props> = ({
  id,
  defaultRepo,
  defaultFigmaUrl,
  defaultFigmaFileKey,
  onDone,
}) => {
  const [loading, setLoading] = useState<'gh' | 'fg' | null>(null);

  async function onSyncGitHub() {
    try {
      setLoading('gh');
      await syncGitHub(id, { repo: defaultRepo });
    } catch {
      // noop - errors handled by caller toast typically
    } finally {
      setLoading(null);
      onDone?.();
    }
  }

  async function onSyncFigma() {
    try {
      setLoading('fg');
      await syncFigma(id, { figmaPublicUrl: defaultFigmaUrl, figmaFileKey: defaultFigmaFileKey });
    } catch {
      // noop
    } finally {
      setLoading(null);
      onDone?.();
    }
  }

  return (
    <div className='adminProjectTable__actions'>
      <button
        className='adminProjectTable__action adminProjectTable__action--github'
        onClick={onSyncGitHub}
        disabled={loading !== null}
        aria-busy={loading === 'gh'}>
        {loading === 'gh' ? 'Syncing...' : 'Sync GitHub'}
      </button>
      <button
        className='adminProjectTable__action adminProjectTable__action--figma'
        onClick={onSyncFigma}
        disabled={loading !== null}
        aria-busy={loading === 'fg'}>
        {loading === 'fg' ? 'Syncing...' : 'Sync Figma'}
      </button>
    </div>
  );
};

export default AdminProjectSyncButtons;
