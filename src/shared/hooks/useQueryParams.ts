// /src/shared/hooks/useQueryParams.ts
'use strict';

import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * useQueryParams
 * - Read and write querystring in a typed and safe way.
 * - Keeps react-router history in sync (push or replace).
 */
export function useQueryParams() {
  const location = useLocation();
  const navigate = useNavigate();

  const getAll = useCallback((): URLSearchParams => {
    return new URLSearchParams(location.search || '');
  }, [location.search]);

  const get = useCallback(
    (key: string): string | null => {
      return getAll().get(key);
    },
    [getAll]
  );

  const setMany = useCallback(
    (entries: Record<string, string | number | undefined | null>, replace = false): void => {
      const qs = getAll();
      Object.entries(entries).forEach(([k, v]) => {
        if (v === undefined || v === null || v === '') {
          qs.delete(k);
        } else {
          qs.set(k, String(v));
        }
      });

      const nextSearch = `?${qs.toString()}`;
      const next = { pathname: location.pathname, search: nextSearch };
      if (replace) {
        navigate(next, { replace: true });
      } else {
        navigate(next);
      }
    },
    [getAll, location.pathname, navigate]
  );

  return { get, setMany, getAll };
}
