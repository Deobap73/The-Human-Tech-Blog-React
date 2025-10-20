// /src/features/projects/components/GitHubMeta.tsx

'use strict';

import React from 'react';

interface GitHubMetaProps {
  meta: {
    repo?: string;
    stars?: number;
    lastCommitAt?: string;
    topics?: string[];
    description?: string;
  };
}

/**
 * GitHubMeta
 * - Shows simple metadata about the associated GitHub repo
 * - Keep it minimal and readable
 */
const GitHubMeta: React.FC<GitHubMetaProps> = ({ meta }) => {
  const { repo, stars, lastCommitAt, topics, description } = meta;

  return (
    <div className='githubMeta'>
      {description && <p className='githubMeta__description'>{description}</p>}

      <ul className='githubMeta__stats'>
        {repo && (
          <li className='githubMeta__stat'>
            <span className='githubMeta__label'>Repository:</span> {repo}
          </li>
        )}
        {typeof stars === 'number' && (
          <li className='githubMeta__stat'>
            <span className='githubMeta__label'>Stars:</span> {stars}
          </li>
        )}
        {lastCommitAt && (
          <li className='githubMeta__stat'>
            <span className='githubMeta__label'>Last commit:</span>{' '}
            {new Date(lastCommitAt).toLocaleString()}
          </li>
        )}
      </ul>

      {topics && topics.length > 0 && (
        <ul className='githubMeta__topics'>
          {topics.map((t) => (
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
