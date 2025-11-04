'use strict';

/**
 * Path: /src/features/projects/components/Pagination.tsx
 */

import React from 'react';
import '../styles/Pagination.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Pagination
 * - Accessible, keyboard-friendly pager.
 * - Mirrors "Figma to code" minimal style; uses blog tokens.
 */
const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const goto = (p: number): void => {
    const safe = Math.max(1, Math.min(totalPages, p));
    onPageChange(safe);
  };

  const items: number[] = [];
  for (let i = 1; i <= totalPages; i += 1) items.push(i);

  return (
    <nav className='pagination' role='navigation' aria-label='Projects pagination'>
      <button
        className='pagination__control'
        type='button'
        disabled={!canPrev}
        aria-label='Previous page'
        onClick={() => goto(currentPage - 1)}>
        ‹
      </button>

      <ul className='pagination__list'>
        {items.map((n) => (
          <li key={n} className='pagination__item'>
            <button
              type='button'
              className={`pagination__page${n === currentPage ? ' pagination__page--active' : ''}`}
              aria-current={n === currentPage ? 'page' : undefined}
              onClick={() => goto(n)}>
              {n}
            </button>
          </li>
        ))}
      </ul>

      <button
        className='pagination__control'
        type='button'
        disabled={!canNext}
        aria-label='Next page'
        onClick={() => goto(currentPage + 1)}>
        ›
      </button>
    </nav>
  );
};

export default Pagination;
