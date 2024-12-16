import React from 'react';
import { PageButton, PaginationWrapper } from '../styles/ComponentStyles';

const Pagination: React.FC<PaginationProps> = ({
  list,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}) => {
  return (
    <PaginationWrapper>
      {[...Array(Math.ceil(list.length / itemsPerPage))].map((_, index) => (
        <PageButton
          key={index + 1}
          onClick={() => setCurrentPage(index + 1)}
          $active={currentPage === index + 1}
          disabled={currentPage === index + 1}
        >
          {index + 1}
        </PageButton>
      ))}
    </PaginationWrapper>
  );
};

export default Pagination;
