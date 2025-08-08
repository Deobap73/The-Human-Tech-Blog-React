// /src/features/post/components/InsertTableModal.tsx
import { useEffect, useRef, useState } from 'react';
import '../styles/InsertTableModal.scss';

interface InsertTableModalProps {
  onInsert: (rows: number, cols: number, withHeader: boolean) => void;
  onCancel: () => void;
}

/**
 * Simple, accessible modal to insert a customizable table.
 * Uses BEM classes for styling and keyboard focus management.
 */
const InsertTableModal = ({ onInsert, onCancel }: InsertTableModalProps) => {
  const [rows, setRows] = useState<number>(3);
  const [cols, setCols] = useState<number>(3);
  const [withHeader, setWithHeader] = useState<boolean>(true);

  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handler);
    dialogRef.current?.focus();
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div className='insert-table-modal' role='dialog' aria-modal='true'>
      <div
        className='insert-table-modal__dialog'
        ref={dialogRef}
        tabIndex={-1}
        aria-label='Insert table dialog'>
        <h3 className='insert-table-modal__title'>Insert Table</h3>

        <div className='insert-table-modal__row'>
          <label className='insert-table-modal__label' htmlFor='rows'>
            Rows
          </label>
          <input
            id='rows'
            className='insert-table-modal__input'
            type='number'
            min={1}
            max={20}
            value={rows}
            onChange={(e) => setRows(Math.max(1, Math.min(20, Number(e.target.value))))}
          />
        </div>

        <div className='insert-table-modal__row'>
          <label className='insert-table-modal__label' htmlFor='cols'>
            Columns
          </label>
          <input
            id='cols'
            className='insert-table-modal__input'
            type='number'
            min={1}
            max={20}
            value={cols}
            onChange={(e) => setCols(Math.max(1, Math.min(20, Number(e.target.value))))}
          />
        </div>

        <div className='insert-table-modal__row insert-table-modal__row--inline'>
          <input
            id='withHeader'
            type='checkbox'
            checked={withHeader}
            onChange={(e) => setWithHeader(e.target.checked)}
          />
          <label className='insert-table-modal__label' htmlFor='withHeader'>
            Include header row
          </label>
        </div>

        <div className='insert-table-modal__actions'>
          <button
            type='button'
            className='insert-table-modal__btn insert-table-modal__btn--cancel'
            onClick={onCancel}>
            Cancel
          </button>
          <button
            type='button'
            className='insert-table-modal__btn insert-table-modal__btn--insert'
            onClick={() => onInsert(rows, cols, withHeader)}>
            Insert
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsertTableModal;
