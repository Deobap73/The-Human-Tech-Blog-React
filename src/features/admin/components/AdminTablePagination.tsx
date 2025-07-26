// /src/features/admin/components/AdminTablePagination.tsx

import { Helmet } from 'react-helmet-async';

import React from 'react';

export interface AdminTablePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const AdminTablePagination: React.FC<AdminTablePaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <>
      <Helmet>
        <meta name='robots' content='noindex, nofollow' />
      </Helmet>

      <div className='admin-table-pagination'>
        <button
          className='admin-table-pagination__btn'
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}>
          &lt;
        </button>
        <span className='admin-table-pagination__info'>
          {page} / {totalPages}
        </span>
        <button
          className='admin-table-pagination__btn'
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}>
          &gt;
        </button>
      </div>
    </>
  );
};

export default AdminTablePagination;
