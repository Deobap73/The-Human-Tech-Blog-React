// /src/features/projects/components/ProjectFreshnessBadge.tsx
'use strict';

import React from 'react';
import { isFresh, ageHumanized } from '../utils/freshness';
import '../styles/ProjectFreshnessBadge.scss';

interface Props {
  label: 'GitHub' | 'Figma';
  timestampIso?: string;
  ttlMs?: number;
}

/**
 * ProjectFreshnessBadge
 * - Shows Fresh/Stale + relative age for a given timestamp.
 */
const ProjectFreshnessBadge: React.FC<Props> = ({
  label,
  timestampIso,
  ttlMs = 60 * 60 * 1000,
}) => {
  if (!timestampIso) return null;
  const fresh = isFresh(timestampIso, ttlMs);
  const age = ageHumanized(timestampIso);

  return (
    <span
      className={`freshBadge freshBadge--${fresh ? 'fresh' : 'stale'}`}
      title={`${label} meta updated ${age}`}>
      {label}: {fresh ? 'Fresh' : 'Stale'} · {age}
    </span>
  );
};

export default ProjectFreshnessBadge;
