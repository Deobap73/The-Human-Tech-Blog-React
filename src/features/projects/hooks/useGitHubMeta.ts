// /src/features/projects/hooks/useGitHubMeta.ts
'use strict';

import { useEffect, useMemo, useState } from 'react';

export interface LiveGitHubMeta {
  stars?: number;
  lastCommitAt?: string;
  description?: string;
  topics?: string[];
}

/**
 * useGitHubMeta
 * - Lightweight "live" meta fetch using the public GitHub API (unauthenticated).
 * - Accepts "owner/repo" and returns stars, pushed_at (as lastCommitAt), description and topics.
 * - Gracefully falls back to provided defaults and aborts on unmount.
 */
export function useGitHubMeta(
  repo?: string,
  defaults?: LiveGitHubMeta
): { meta: LiveGitHubMeta; loading: boolean; error: string } {
  const [meta, setMeta] = useState<LiveGitHubMeta>(defaults ?? {});
  const [loading, setLoading] = useState<boolean>(!!repo);
  const [error, setError] = useState<string>('');

  const url = useMemo(() => {
    if (!repo || !/^[\w.-]+\/[\w.-]+$/.test(repo)) return null;
    return `https://api.github.com/repos/${repo}`;
  }, [repo]);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            // NOTE: unauthenticated request; keep headers minimal
            Accept: 'application/vnd.github+json',
          },
        });

        if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);

        const data = (await res.json()) as {
          stargazers_count?: number;
          pushed_at?: string;
          description?: string;
          topics?: string[];
        };

        setMeta({
          stars: data.stargazers_count ?? defaults?.stars,
          lastCommitAt: data.pushed_at ?? defaults?.lastCommitAt,
          description: data.description ?? defaults?.description,
          topics: data.topics ?? defaults?.topics,
        });
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          setError('Failed to load GitHub metadata.');
        }
      } finally {
        setLoading(false);
      }
    };

    void load();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { meta, loading, error };
}
