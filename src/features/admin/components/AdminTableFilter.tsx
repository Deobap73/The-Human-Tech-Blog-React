// /src/features/admin/components/AdminTableFilter.tsx

import { Helmet } from 'react-helmet-async';

import React, { useState, useEffect } from 'react';
import '../../admin/styles/AdminTableFilter.scss';

interface AdminTableFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

/**
 * Simple reusable filter input for admin lists.
 * - Props: value, onChange, placeholder.
 * - Debounces changes for better performance in big lists.
 */
const AdminTableFilter: React.FC<AdminTableFilterProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  autoFocus = false,
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce filter to avoid firing on every keystroke.
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== value) onChange(localValue);
    }, 300);
    return () => clearTimeout(handler);
    // eslint-disable-next-line
  }, [localValue]);

  return (
    <>
      <Helmet>
        <meta name='robots' content='noindex, nofollow' />
      </Helmet>

      <div className='admin-table-filter'>
        <input
          type='text'
          className='admin-table-filter__input'
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
        />
        {localValue && (
          <button
            type='button'
            className='admin-table-filter__clear'
            onClick={() => {
              setLocalValue('');
              onChange('');
            }}
            aria-label='Clear search'>
            ×
          </button>
        )}
      </div>
    </>
  );
};

export default AdminTableFilter;
