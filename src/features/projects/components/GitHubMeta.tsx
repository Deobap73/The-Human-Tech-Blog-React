// /src/features/projects/components/GitHubMeta.tsx
'use strict';

import React from 'react';
import { useGitHubMeta } from '../hooks/useGitHubMeta';

interface GitHubMetaProps {
  meta: {
    repo?: string;
    stars?: number;
    lastCommitAt?: string;
    topics?: string[];
    description?: string;
  };
  live?: boolean; // opt-in to fetch live meta from GitHub API
}

/**
 * GitHubMeta
 * - Shows readable metadata about the associated GitHub repo.
 * - If "live" is true and "repo" is provided, shows live stars/last commit.
 */
const GitHubMeta: React.FC<GitHubMetaProps> = ({ meta, live = true }) => {
  const defaults = {
    stars: meta.stars,
    lastCommitAt: meta.lastCommitAt,
    description: meta.description,
    topics: meta.topics,
  };

  const { meta: liveMeta } = useGitHubMeta(meta.repo, defaults);
  const data = live ? liveMeta : defaults;

  return (
    <div className='githubMeta'>
      {data.description && <p className='githubMeta__description'>{data.description}</p>}

      <dl className='githubMeta__stats' aria-label='GitHub repository stats'>
        {meta.repo && (
          <>
            <dt className='githubMeta__label'>Repository:</dt>
            <dd className='githubMeta__value'>{meta.repo}</dd>
          </>
        )}
        {typeof data.stars === 'number' && (
          <>
            <dt className='githubMeta__label'>Stars:</dt>
            <dd className='githubMeta__value'>{data.stars}</dd>
          </>
        )}
        {data.lastCommitAt && (
          <>
            <dt className='githubMeta__label'>Last commit:</dt>
            <dd className='githubMeta__value'>{new Date(data.lastCommitAt).toLocaleString()}</dd>
          </>
        )}
      </dl>

      {data.topics && data.topics.length > 0 && (
        <ul className='githubMeta__topics' aria-label='Repository topics'>
          {data.topics.map((t) => (
            <li key={t} className='githubMeta__topic'>
              {t}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GitHubMeta;
