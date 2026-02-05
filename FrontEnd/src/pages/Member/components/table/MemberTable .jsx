import React, { useEffect, useState, useMemo } from 'react';
import { companyEmployee } from '../../../../api/company.js';
import ReusableTable from './ReusableTable.jsx';
import styled from 'styled-components';
import Pagination from '../../../../components/common/Pagination';
import useAuthStore from '../../../../store/authStore.js';
import Swal from 'sweetalert2';
import SwalStyles from '../../../../styles/SwalStyles.js';

const MemberTable = ({ searchKeyword, currentPage, setCurrentPage }) => {
  const [members, setMembers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const { loginUser } = useAuthStore();

  const isMaster = loginUser?.role === 'MASTER';

  const pageSize = 15;

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
        Cell: ({ row }) => {
          const currentMember = row;
          const currentRole = currentMember.role;
          const userName = currentMember.name;

          const handleChange = async (e) => {
            const newRoleKey = e.target.value;

            const result = await Swal.fire({
              title: '등급 변경',
              text: `"${userName}"님의 등급을 "${roleMap[currentRole]}"에서 "${roleMap[newRoleKey]}"로 변경하시겠습니까?`,
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: '변경',
              cancelButtonText: '취소',
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
            });

            if (!result.isConfirmed) {
              e.target.value = currentRole;
              return;
            }

            try {
              const jwt = await companyEmployee.updateRole(currentMember.user_no, newRoleKey);
              if (jwt) {
                localStorage.setItem('token', jwt);
                await Swal.fire({
                  icon: 'success',
                  title: '변경 완료',
                  text: `"${userName}"님의 등급이 변경되었습니다.`,
                  timer: 1500,
                  showConfirmButton: false,
                });
                window.location.reload();
              }
              setMembers((prev) =>
                prev.map((m) => (m.user_no === currentMember.user_no ? { ...m, role: newRoleKey } : m))
              );

              Swal.fire({
                icon: 'success',
                title: '변경 완료',
                text: `"${userName}"님의 등급이 변경되었습니다.`,
                timer: 1500,
                showConfirmButton: false,
              });
            } catch (err) {
              Swal.fire({
                icon: 'error',
                title: '오류 발생',
                text: err.message || '등급 변경에 실패했습니다.',
              });
              e.target.value = currentRole;
            }
          };

          return (
            <Select value={currentRole} onChange={handleChange} disabled={!isMaster}>
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
        setTotalPages(data.total_page);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      }
    };

    fetchData();
  }, [loginUser, currentPage, searchKeyword]);

  // use shared Pagination component (props passed from parent)

  return (
    <>
      <SwalStyles />
      <ReusableTable columns={columns} data={filteredMembers} />
      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
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

/* Pagination replaced by shared component */

export default MemberTable;
