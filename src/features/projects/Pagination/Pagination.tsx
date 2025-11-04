// src/features/projects/Pagination/Pagination.tsx

'use strict';

import React from 'react';
import './Pagination.scss';

export interface PaginationProps {
  currentPage: number; // 1-based
  totalPages: number; // >= 1
  onPageChange: (page: number) => void;
  siblingCount?: number;
  ariaLabel?: string;
  /** Compact density mode (reduces paddings/gaps) */
  compact?: boolean;
}

const clamp = (n: number, min: number, max: number): number => Math.max(min, Math.min(n, max));

/**
 * Pagination (Figma-to-code parity)
 * - Ellipses, keyboard-friendly, accessible.
 * - Compact mode supported via BEM modifier.
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  ariaLabel = 'Paginação de projetos',
  compact = false,
}) => {
  if (totalPages <= 1) return null;

  const goTo = (p: number): void => onPageChange(clamp(p, 1, totalPages));

  const start = Math.max(2, currentPage - siblingCount);
  const end = Math.min(totalPages - 1, currentPage + siblingCount);

  const range: (number | '…')[] = [1];
  if (start > 2) range.push('…');
  for (let p = start; p <= end; p += 1) range.push(p);
  if (end < totalPages - 1) range.push('…');
  if (totalPages > 1) range.push(totalPages);

  const rootCls = ['pag', compact ? 'pag--compact' : ''].filter(Boolean).join(' ');

  return (
    <nav className={rootCls} role='navigation' aria-label={ariaLabel}>
      <ul className='pag__list'>
        <li className='pag__item'>
          <button
            type='button'
            className='pag__btn'
            onClick={() => goTo(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label='Página anterior'>
            ‹
          </button>
        </li>

        {range.map((it, idx) =>
          it === '…' ? (
            <li key={`dots-${idx}`} className='pag__item' aria-hidden='true'>
              <span className='pag__dots'>…</span>
            </li>
          ) : (
            <li key={it} className='pag__item'>
              <button
                type='button'
                className={`pag__btn ${it === currentPage ? 'pag__btn--active' : ''}`}
                aria-current={it === currentPage ? 'page' : undefined}
                onClick={() => goTo(it)}>
                {it}
              </button>
            </li>
          )
        )}

        <li className='pag__item'>
          <button
            type='button'
            className='pag__btn'
            onClick={() => goTo(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label='Próxima página'>
            ›
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
