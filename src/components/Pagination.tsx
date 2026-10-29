import React from 'react';
import styled from 'styled-components';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons/icons';

const Nav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem;
  margin-top: 2.5rem;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  display: grid;
  place-items: center;
  min-width: 42px;
  height: 42px;
  padding: 0 0.6rem;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1.5px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.surface};
  color: ${({ $active, theme }) => ($active ? '#fff' : theme.colors.text)};
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: ${({ $active }) => ($active ? 1 : 0.4)};
    cursor: default;
  }

  svg {
    width: 18px;
    height: 18px;
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

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

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
      {pages.map((page) => (
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
      ))}
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
