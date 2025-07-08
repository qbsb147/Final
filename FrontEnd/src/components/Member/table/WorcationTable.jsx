import React, { useEffect, useState, useMemo } from 'react';
import { companyEmployee } from '../../../api/company';
import ReusableTable from './ReusableTable';
import styled from 'styled-components';
import useAuthStore from '../../../store/authStore';

const WorcationTable = ({ searchKeyword, currentPage, setCurrentPage }) => {
  const [members, setMembers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const { loginUser } = useAuthStore();

  const pageSize = 15; // 한 페이지에 보여줄 데이터 수 (백엔드와 맞춰야 함)

  const columns = useMemo(
    () => [
      { header: '부서', accessor: 'department' },
      { header: '직급', accessor: 'position' },
      { header: '이름', accessor: 'name' },
      { header: '성별', accessor: 'gender' },
      { header: '나이', accessor: 'age' },
      { header: '이메일', accessor: 'email' },
      { header: '신청 기간', accessor: 'period' },
      { header: '워케이션 장소', accessor: 'location' },
      {
        header: '승인 여부',
        accessor: 'actions',
        Cell: ({ rowIndex }) => {
          const row = filteredMembers[rowIndex];

          const handleApprove = async () => {
            if (!window.confirm(`${row.name}님의 워케이션을 승인하시겠습니까?`)) return;

            try {
              await companyEmployee.UpdateWorcationCheck(row.user_no, 'Y');
              alert('승인 완료');
              setMembers((prev) => prev.filter((m) => m.user_no !== row.user_no));
            } catch (error) {
              alert(error.message);
            }
          };

          const handleReject = async () => {
            if (!window.confirm(`${row.name}님의 워케이션을 거부하시겠습니까?`)) return;

            try {
              await companyEmployee.UpdateWorcationCheck(row.user_no, 'N');
              alert('거부 완료');
              setMembers((prev) => prev.filter((m) => m.user_no !== row.user_no));
            } catch (error) {
              alert(error.message);
            }
          };

          return (
            <>
              <button onClick={handleApprove}>승인</button>
              <button onClick={handleReject}>거부</button>
            </>
          );
        },
      },
    ],
    [members]
  );

  const filteredMembers = useMemo(() => {
    if (!searchKeyword) return members;
    return members.filter((m) => m.name.toLowerCase().includes(searchKeyword.toLowerCase()));
  }, [members, searchKeyword]);

  useEffect(() => {
    if (!loginUser) return;

    const fetchData = async () => {
      try {
        const data = await companyEmployee.getWorcationApplies(loginUser.company_no, currentPage, pageSize);
        // 백엔드에서 pagination이 지원된다면 currentPage, pageSize 전달
        // 만약 백엔드가 지원하지 않는다면 프론트에서 잘라서 처리해야 함

        const formatted = data.content.map((member) => ({
          user_no: member.user_no,
          department: member.department_name,
          position: member.position,
          name: member.name,
          gender: member.gender === 'M' ? '남성' : '여성',
          age: member.age,
          email: member.company_email,
          period: member.worcation_date,
          location: member.worcation_place,
        }));

        setMembers(formatted);
        setTotalPages(data.total_page);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      }
    };

    fetchData();
  }, [loginUser, currentPage, searchKeyword]);

  // 페이지네이션: 5개씩 묶어서 그룹 단위 이동 구현
  const maxPageButtons = 5;
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
    <>
      <ReusableTable columns={columns} data={filteredMembers} />

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

export default WorcationTable;
