// /src/features/projects/components/ProjectsTabs.tsx
'use strict';

import React from 'react';
import '../styles/ProjectsTabs.scss';

// Strongly typed tab ids to match ProjectsPage
export type TabId = 'frontend-ui' | 'ux-figma' | 'full';

interface Props {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
}

const tabs: ReadonlyArray<{ id: TabId; label: string }> = [
  { id: 'frontend-ui', label: 'Frontend UI' },
  { id: 'ux-figma', label: 'UX / Figma Drafts' },
  { id: 'full', label: 'Full Projects' },
];

const ProjectsTabs: React.FC<Props> = ({ activeTab, onChange }) => {
  return (
    <div className='projectsTabs' role='tablist' aria-label='Projects categories'>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role='tab'
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          id={`tab-${tab.id}`}
          className={`projectsTabs__tab ${activeTab === tab.id ? 'is-active' : ''}`}
          onClick={() => onChange(tab.id)}
          type='button'>
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ProjectsTabs;
