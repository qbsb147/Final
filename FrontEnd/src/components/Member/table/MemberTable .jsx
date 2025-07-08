import React, { useEffect, useState, useMemo } from 'react';
import { companyEmployee } from '../../../api/company';
import ReusableTable from './ReusableTable';
import styled from 'styled-components';
import useAuthStore from '../../../store/authStore';

const MemberTable = ({ searchKeyword, currentPage, setCurrentPage }) => {
  const [members, setMembers] = useState([]);
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
  const { loginUser } = useAuthStore();

  const pageSize = 15; // 한 페이지에 보여줄 데이터 수 (백엔드와 맞춰야 함)

  const roleMap = {
    MASTER: '대표',
    MANAGER: '매니저',
    EMPLOYEE: '직원',
  };

  const columns = useMemo(
    () => [
      { header: '부서', accessor: 'department' },
      { header: '직급', accessor: 'position' },
      { header: '이름', accessor: 'name' },
      { header: '성별', accessor: 'gender' },
      { header: '나이', accessor: 'age' },
      {
        header: '등급',
        accessor: 'role',
        Cell: ({ rowIndex }) => {
          const currentMember = filteredMembers[rowIndex];
          const currentRole = currentMember.role;
          const userName = currentMember.name;

          const handleChange = async (e) => {
            const newRoleKey = e.target.value;

            const confirmed = window.confirm(
              `"${userName}"님의 등급을 "${roleMap[currentRole]}"에서 "${roleMap[newRoleKey]}"로 변경하시겠습니까?`
            );
            if (!confirmed) {
              e.target.value = currentRole;
              return;
            }

            try {
              await companyEmployee.updateRole(currentMember.user_no, newRoleKey);

              setMembers((prev) =>
                prev.map((m) => (m.user_no === currentMember.user_no ? { ...m, role: newRoleKey } : m))
              );
            } catch (err) {
              alert(err.message || '등급 변경에 실패했습니다.');
              e.target.value = currentRole;
            }
          };

          return (
            <Select value={currentRole} onChange={handleChange}>
              {Object.entries(roleMap).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Select>
          );
        },
      },
      { header: '이메일', accessor: 'company_email' },
      { header: '근무 현황', accessor: 'status' },
    ],
    [members]
  );

  const filteredMembers = useMemo(() => {
    if (!searchKeyword) return members;
    return members.filter((m) => m.name.toLowerCase().includes(searchKeyword.toLowerCase()));
  }, [members, searchKeyword]);

  useEffect(() => {
    const fetchData = async () => {
      if (!loginUser) return;

      try {
        const data = await companyEmployee.getEmployeeList(loginUser.company_no, currentPage, pageSize);
        // console.log('API response data:', data);

        const formatted = data.content.map((member) => ({
          user_no: member.user_no,
          department: member.department_name,
          position: member.position,
          name: member.name,
          gender: ['M', 'm'].includes(member.gender) ? '남성' : '여성',
          age: member.age,
          role: member.role,
          company_email: member.company_email,
          status: member.work_status,
        }));

        setMembers(formatted);
        setTotalPages(data.total_page); // 여기 수정됨
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

const Select = styled.select`
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
  border: none;
  font-weight: bold;
  text-align: center;
  text-align-last: center;
`;

// active prop이 DOM으로 전달되지 않도록 처리
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

export default MemberTable;
