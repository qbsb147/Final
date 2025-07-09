import React, { useEffect, useState, useMemo } from 'react';
import { worcationService } from '../../api/worcations';
import ReusableTable from '../Member/table/ReusableTable';
import styled from 'styled-components';
import useAuthStore from '../../store/userStore';

const ReservationTable = ({ searchKeyword, currentPage, setCurrentPage }) => {
  const [members, setMembers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const { loginUser } = useAuthStore();

  const pageSize = 15;

  const columns = useMemo(
    () => [
      { header: '회사명', accessor: 'company_name' },
      { header: '이름', accessor: 'user_name' },
      { header: '워케이션명', accessor: 'worcation_name' },
      { header: '나이', accessor: 'age' },
      { header: '성별', accessor: 'gender' },
      { header: '전화번호', accessor: 'phone' },
      { header: '이메일', accessor: 'company_email' },
      { header: '예약일자', accessor: 'date' },
    ],
    []
  );

  const filteredMembers = useMemo(() => {
    if (!searchKeyword) return members;
    return members.filter((m) => m.user_name.toLowerCase().includes(searchKeyword.toLowerCase()));
  }, [members, searchKeyword]);

  useEffect(() => {
    const fetchData = async () => {
      if (!loginUser) return;

      try {
        const data = await worcationService.WorcationReservation(loginUser.company_no, currentPage, pageSize);

        setMembers(data.content);
        setTotalPages(data.total_page);
      } catch (error) {
        console.error('예약자 목록 로딩 실패:', error);
      }
    };

    fetchData();
  }, [loginUser, currentPage, searchKeyword]);

  const maxPageButtons = 5;
  const currentGroup = Math.floor(currentPage / maxPageButtons);
  const startPage = currentGroup * maxPageButtons;
  const endPage = Math.min(startPage + maxPageButtons - 1, totalPages - 1);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const goToPrevGroup = () => {
    if (currentGroup > 0) setCurrentPage((currentGroup - 1) * maxPageButtons);
  };

  const goToNextGroup = () => {
    const nextGroupStart = (currentGroup + 1) * maxPageButtons;
    if (nextGroupStart < totalPages) setCurrentPage(nextGroupStart);
  };

  const goToPage = (pageNum) => {
    if (pageNum >= 0 && pageNum < totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <>
      <ReusableTable columns={columns} data={filteredMembers} messageWhenEmpty="예약자가 없습니다." />

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
    </>
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

export default ReservationTable;
