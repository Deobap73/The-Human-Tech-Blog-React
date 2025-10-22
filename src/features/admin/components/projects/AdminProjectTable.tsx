// /src/features/admin/components/projects/AdminProjectTable.tsx
'use strict';

import React from 'react';
import type { Project } from '../../../../shared/types/Project';
import AdminProjectRow from './AdminProjectRow';
import '../../styles/AdminProjectTable.scss';

interface Props {
  items: Project[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onReload: () => void;
}

/**
 * AdminProjectTable
 * - Renders the projects table with BEM styles.
 */
const AdminProjectTable: React.FC<Props> = ({ items, selected, onToggle, onReload }) => {
  return (
    <div className='adminProjectTable'>
      <table className='adminProjectTable__table'>
        <thead className='adminProjectTable__head'>
          <tr className='adminProjectTable__row adminProjectTable__row--head'>
            <th className='adminProjectTable__cell adminProjectTable__cell--check'>Sel.</th>
            <th className='adminProjectTable__cell'>Project</th>
            <th className='adminProjectTable__cell'>Type</th>
            <th className='adminProjectTable__cell'>Source</th>
            <th className='adminProjectTable__cell'>GitHub</th>
            <th className='adminProjectTable__cell'>Figma</th>
            <th className='adminProjectTable__cell'>Actions</th>
          </tr>
        </thead>
        <tbody className='adminProjectTable__body'>
          {items.map((p) => (
            <AdminProjectRow
              key={p._id}
              project={p}
              selected={selected.has(p._id)}
              onToggle={onToggle}
              onReload={onReload}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProjectTable;
