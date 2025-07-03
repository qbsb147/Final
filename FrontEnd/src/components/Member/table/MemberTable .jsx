import React, { useEffect, useState, useMemo } from 'react';
import { companyEmployee } from '../../../api/company';
import ReusableTable from './ReusableTable';
import styled from 'styled-components';

const MemberTable = ({ searchKeyword }) => {
  const [members, setMembers] = useState([]);

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
      try {
        //현재 2번만 불러오게함 로그인되면 바꿀예정
        const data = await companyEmployee.getEmployeeList(1);

        const formatted = data.map((member) => ({
          user_no: member.user_no,
          department: member.department_name,
          position: member.position,
          name: member.name,
          gender: member.gender === 'M' ? '남성' : '여성',
          age: member.age,
          role: member.role,
          company_email: member.company_email,
          status: member.work_status,
        }));

        setMembers(formatted);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      }
    };

    fetchData();
  }, []);

  return <ReusableTable columns={columns} data={filteredMembers} />;
};

const Select = styled.select`
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
  border: none;
  font-weight: bold;
  text-align: center;
  text-align-last: center;
`;

export default MemberTable;
