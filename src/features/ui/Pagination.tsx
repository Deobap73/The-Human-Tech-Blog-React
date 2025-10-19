// src/components/pagination/Pagination.tsx
// /src/ui/Pagination.tsx
'use strict';

import React from 'react';
import './styles/Pagination.scss';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** How many page buttons to show around the current page (window size). Default: 2 */
  siblingCount?: number;
}

const clamp = (num: number, min: number, max: number) => Math.max(min, Math.min(max, num));

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 2,
}) => {
  if (totalPages <= 1) return null;

  const goTo = (page: number) => onPageChange(clamp(page, 1, totalPages));

  // Build windowed pages around current
  const start = Math.max(1, currentPage - siblingCount);
  const end = Math.min(totalPages, currentPage + siblingCount);
  const pages: number[] = [];
  for (let p = start; p <= end; p += 1) pages.push(p);

  const showFirst = start > 1;
  const showLeftEllipsis = start > 2;
  const showRightEllipsis = end < totalPages - 1;
  const showLast = end < totalPages;

  return (
    <nav className='pagination' role='navigation' aria-label='Pagination'>
      <button
        type='button'
        className='pagination__btn pagination__btn--nav'
        onClick={() => goTo(1)}
        disabled={currentPage === 1}
        aria-label='First page'>
        «
      </button>

      <button
        type='button'
        className='pagination__btn pagination__btn--nav'
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label='Previous page'>
        ‹
      </button>

      <ul className='pagination__list'>
        {showFirst && (
          <li>
            <button
              type='button'
              className='pagination__btn'
              onClick={() => goTo(1)}
              aria-label='Page 1'
              aria-current={currentPage === 1 ? 'page' : undefined}>
              1
            </button>
          </li>
        )}

        {showLeftEllipsis && <li className='pagination__ellipsis'>…</li>}

        {pages.map((p) => (
          <li key={p}>
            <button
              type='button'
              className={`pagination__btn${p === currentPage ? ' is-active' : ''}`}
              onClick={() => goTo(p)}
              aria-label={`Page ${p}`}
              aria-current={p === currentPage ? 'page' : undefined}>
              {p}
            </button>
          </li>
        ))}

        {showRightEllipsis && <li className='pagination__ellipsis'>…</li>}

        {showLast && (
          <li>
            <button
              type='button'
              className='pagination__btn'
              onClick={() => goTo(totalPages)}
              aria-label={`Page ${totalPages}`}
              aria-current={currentPage === totalPages ? 'page' : undefined}>
              {totalPages}
            </button>
          </li>
        )}
      </ul>

      <button
        type='button'
        className='pagination__btn pagination__btn--nav'
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label='Next page'>
        ›
      </button>

      <button
        type='button'
        className='pagination__btn pagination__btn--nav'
        onClick={() => goTo(totalPages)}
        disabled={currentPage === totalPages}
        aria-label='Last page'>
        »
      </button>
    </nav>
  );
};

export default Pagination;
