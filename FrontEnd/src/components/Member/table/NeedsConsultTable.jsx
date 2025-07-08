import React, { useState, useEffect, useMemo } from 'react';
import ReusableTable from './ReusableTable';
import { companyEmployee } from '../../../api/company';
import styled from 'styled-components';
import useAuthStore from '../../../store/authStore';

const NeedsConsultTable = ({ searchKeyword, currentPage, setCurrentPage }) => {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const { loginUser } = useAuthStore();
  const pageSize = 15;

  // searchKeyword 바뀌면 페이지 초기화
  useEffect(() => {
    setCurrentPage(0);
  }, [searchKeyword]);

  useEffect(() => {
    if (!loginUser?.company_no) return;

    const fetchData = async () => {
      setError(null);
      try {
        // 페이지 정보 포함해서 API 호출
        const result = await companyEmployee.getneedsConsult(loginUser.company_no, currentPage, pageSize);

        const genderMap = { M: '남성', W: '여성' };
        const stateMap = { Severe: '심각', Critical: '위급' };

        // API 응답이 { content: [], totalPages: n } 형태라 가정
        const dataArray = Array.isArray(result) ? result : result.content || [];

        const translated = dataArray.map((item) => ({
          ...item,
          gender: genderMap[item.gender] || item.gender,
          psychological_state: stateMap[item.psychological_state] || item.psychological_state,
        }));

        setData(translated);
        setTotalPages(result.totalPages || 1); // 총 페이지 수 세팅
      } catch (err) {
        setError(err.message || '데이터를 불러오는데 실패했습니다.');
      }
    };

    fetchData();
  }, [loginUser?.company_no, currentPage, pageSize]);

  const columns = useMemo(
    () => [
      { header: '부서', accessor: 'department_name' },
      { header: '직책', accessor: 'position' },
      { header: '이름', accessor: 'name' },
      { header: '성별', accessor: 'gender' },
      { header: '나이', accessor: 'age' },
      { header: '이메일', accessor: 'company_email' },
      { header: '출근상태', accessor: 'work_status' },
      { header: '심리상태', accessor: 'psychological_state' },
    ],
    []
  );

  const filteredData = useMemo(() => {
    if (!searchKeyword) return data;
    return data.filter((item) =>
      Object.values(item).some((value) => value && value.toString().toLowerCase().includes(searchKeyword.toLowerCase()))
    );
  }, [data, searchKeyword]);

  const emptyMessage =
    filteredData.length === 0
      ? searchKeyword && data.length > 0
        ? '직원이 없습니다.'
        : '직원들의 심리 상태가 좋습니다.'
      : '';

  if (error) return <div>{error}</div>;

  // 페이징 그룹 처리 (5개씩 묶기)
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
    if (pageNum >= 0 && pageNum < totalPages) setCurrentPage(pageNum);
  };

  return (
    <>
      <ReusableTable columns={columns} data={filteredData} messageWhenEmpty={emptyMessage} />

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

const PaginationContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
  justify-content: center;
`;

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

export default NeedsConsultTable;
