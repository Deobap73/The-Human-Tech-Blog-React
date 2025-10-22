// /src/features/projects/hooks/useProjectsCache.ts
'use strict';

import { useMemo } from 'react';

type CacheValue<T> = { data: T; ts: number };
type CacheMap<T> = Map<string, CacheValue<T>>;

interface Options {
  ttlMs?: number; // time-to-live in milliseconds
}

/**
 * useProjectsCache
 * - Simple in-memory cache keyed by a stable string.
 * - Designed for grid list caching between navigations.
 */
export function useProjectsCache<T>(options?: Options) {
  const store = useMemo<CacheMap<T>>(() => new Map(), []);
  const ttl = options?.ttlMs ?? 5 * 60 * 1000; // default 5 minutes

  const has = (key: string): boolean => {
    const item = store.get(key);
    if (!item) return false;
    const expired = Date.now() - item.ts > ttl;
    if (expired) {
      store.delete(key);
      return false;
    }
    return true;
  };

  const get = (key: string): T | undefined => {
    if (!has(key)) return undefined;
    return store.get(key)?.data;
  };

  const set = (key: string, data: T): void => {
    store.set(key, { data, ts: Date.now() });
  };

  const clear = (): void => {
    store.clear();
  };

  return { has, get, set, clear };
}
