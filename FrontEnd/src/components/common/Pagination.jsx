import React from 'react';
import styled from 'styled-components';

const Pagination = ({ currentPage, totalPages, setCurrentPage, maxPageButtons = 5 }) => {
  const currentGroup = Math.floor(currentPage / maxPageButtons);
  const startPage = currentGroup * maxPageButtons;
  const endPage = Math.min(startPage + maxPageButtons - 1, totalPages - 1);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const goToPrevGroup = () => {
    if (currentGroup > 0) {
      setCurrentPage((currentGroup - 1) * maxPageButtons);
    }
  };

  const goToNextGroup = () => {
    const nextGroupStart = (currentGroup + 1) * maxPageButtons;
    if (nextGroupStart < totalPages) {
      setCurrentPage(nextGroupStart);
    }
  };

  const goToPage = (pageNum) => {
    if (pageNum >= 0 && pageNum < totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <PaginationContainer>
      <button onClick={goToPrevGroup} disabled={currentGroup === 0}>
        이전
      </button>

      {pageNumbers.map((pageNum) => (
        <PageButton key={pageNum} onClick={() => goToPage(pageNum)} active={pageNum === currentPage}>
          {pageNum + 1}
        </PageButton>
      ))}

      <button onClick={goToNextGroup} disabled={(currentGroup + 1) * maxPageButtons >= totalPages}>
        다음
      </button>
    </PaginationContainer>
  );
};

const PageButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'active',
})`
  padding: 0.3rem 0.6rem;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  background-color: ${({ active, theme }) => (active ? theme.colors.primary : 'transparent')};
  color: ${({ active, theme }) => (active ? theme.colors.white : theme.colors.black)};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const PaginationContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
  justify-content: center;
`;

export default Pagination;

