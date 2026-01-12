// /src/shared/hooks/useDebouncedValue.ts
'use strict';

import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
