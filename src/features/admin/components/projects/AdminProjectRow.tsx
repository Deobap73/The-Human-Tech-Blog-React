// /src/features/admin/components/projects/AdminProjectRow.tsx
'use strict';

import React, { useState } from 'react';
import type { Project } from '../../../../shared/types/Project';
import AdminProjectEditModal from './AdminProjectEditModal';
import AdminProjectSyncButtons from './AdminProjectSyncButtons';
import { useToast } from '../../../../shared/hooks/useToast';
import { syncFigma, syncGitHub } from '../../../../shared/services/adminProjectService';
import ProjectFreshnessBadge from '../../../projects/components/ProjectFreshnessBadge';

interface Props {
  project: Project;
  selected: boolean;
  onToggle: (id: string) => void;
  onReload: () => void;
}

/**
 * AdminProjectRow
 * - Single project row with selection, quick sync buttons and edit modal.
 * - Uses toast helpers from useToast: success() and error().
 */
const AdminProjectRow: React.FC<Props> = ({ project, selected, onToggle, onReload }) => {
  const { success: toastSuccess, error: toastError } = useToast();
  const [editOpen, setEditOpen] = useState<boolean>(false);

  /**
   * Handle save from Edit Modal:
   * - Will call GitHub and/or Figma sync based on provided fields
   * - On success, closes modal and triggers a reload
   */
  async function handleSave(data: {
    repo?: string;
    figmaPublicUrl?: string;
    figmaFileKey?: string;
  }) {
    try {
      if (data.repo) {
        const r = await syncGitHub(project._id, { repo: data.repo });
        if (!r.ok) throw new Error(r.message || 'GitHub sync failed.');
      }
      if (data.figmaPublicUrl || data.figmaFileKey) {
        const r = await syncFigma(project._id, {
          figmaPublicUrl: data.figmaPublicUrl,
          figmaFileKey: data.figmaFileKey,
        });
        if (!r.ok) throw new Error(r.message || 'Figma sync failed.');
      }
      toastSuccess('Saved & synced successfully');
      setEditOpen(false);
      onReload();
    } catch (e) {
      toastError((e as Error).message || 'Failed to save/sync');
    }
  }

  return (
    <>
      <tr className='adminProjectTable__row'>
        <td className='adminProjectTable__cell adminProjectTable__cell--check'>
          <input
            type='checkbox'
            checked={selected}
            onChange={() => onToggle(project._id)}
            aria-label={`Select ${project.title}`}
          />
        </td>

        <td className='adminProjectTable__cell adminProjectTable__cell--title'>
          <div className='adminProjectTable__title'>
            {project.coverImage && (
              <img
                src={project.coverImage}
                alt={project.title}
                loading='lazy'
                className='adminProjectTable__thumb'
              />
            )}
            <div>
              <div className='adminProjectTable__name'>{project.title}</div>
              {project.excerpt && (
                <div className='adminProjectTable__excerpt'>{project.excerpt}</div>
              )}
            </div>
          </div>
        </td>

        <td className='adminProjectTable__cell adminProjectTable__cell--type'>{project.type}</td>

        <td className='adminProjectTable__cell adminProjectTable__cell--source'>
          {project.source ?? '-'}
        </td>

        <td className='adminProjectTable__cell adminProjectTable__cell--repo'>
          {project.meta?.github?.repo ?? '-'}
          {project.meta?.github?.lastCommitAt && (
            <div className='adminProjectTable__fresh'>
              <ProjectFreshnessBadge
                label='GitHub'
                timestampIso={project.meta.github.lastCommitAt}
                ttlMs={60 * 60 * 1000}
              />
            </div>
          )}
        </td>

        <td className='adminProjectTable__cell adminProjectTable__cell--figma'>
          {project.meta?.figma?.fileKey ?? '-'}
          {project.meta?.figma?.lastModified && (
            <div className='adminProjectTable__fresh'>
              <ProjectFreshnessBadge
                label='Figma'
                timestampIso={project.meta.figma.lastModified}
                ttlMs={60 * 60 * 1000}
              />
            </div>
          )}
        </td>

        <td className='adminProjectTable__cell adminProjectTable__cell--actions'>
          <AdminProjectSyncButtons
            id={project._id}
            defaultRepo={project.meta?.github?.repo}
            defaultFigmaUrl={project.links?.figma}
            defaultFigmaFileKey={project.meta?.figma?.fileKey}
            onDone={onReload}
          />
          <button
            type='button'
            className='adminProjectTable__action adminProjectTable__action--edit'
            onClick={() => setEditOpen(true)}
            aria-label={`Edit project ${project.title}`}>
            Edit
          </button>
        </td>
      </tr>

      <AdminProjectEditModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
        initial={{
          repo: project.meta?.github?.repo,
          figmaPublicUrl: project.links?.figma,
          figmaFileKey: project.meta?.figma?.fileKey,
        }}
      />
    </>
  );
};

export default AdminProjectRow;
