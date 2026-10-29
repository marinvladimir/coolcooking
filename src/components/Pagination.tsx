import React from 'react';
import styled from 'styled-components';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons/icons';
import { Button } from '../styles/ui';

const Nav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem;
  margin-top: 3rem;
`;

const PageButton = styled(Button)<{ $active?: boolean }>`
  min-width: 46px;
  padding: 0.6rem 0.75rem;
  font-family: ${({ theme }) => theme.fonts.pixel};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.accent : theme.colors.surface};

  &:disabled {
    opacity: ${({ $active }) => ($active ? 1 : 0.4)};
    cursor: default;
  }
`;

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const pageCount = Math.ceil(totalItems / itemsPerPage);
  if (pageCount <= 1) return null;

  return (
    <Nav aria-label="Pagination">
      <PageButton
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeftIcon />
      </PageButton>
      {Array.from({ length: pageCount }, (_, index) => index + 1).map(
        (page) => (
          <PageButton
            key={page}
            type="button"
            $active={page === currentPage}
            disabled={page === currentPage}
            aria-current={page === currentPage ? 'page' : undefined}
            onClick={() => onPageChange(page)}
          >
            {page}
          </PageButton>
        )
      )}
      <PageButton
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === pageCount}
        aria-label="Next page"
      >
        <ChevronRightIcon />
      </PageButton>
    </Nav>
  );
};

export default Pagination;
