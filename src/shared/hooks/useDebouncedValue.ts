// /src/shared/hooks/useDebouncedValue.ts
'use strict';

import { useEffect, useState } from 'react';

/**
 * useDebouncedValue
 * - Debounces a primitive value by "delay" ms.
 */
export function useDebouncedValue<T extends string | number>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
