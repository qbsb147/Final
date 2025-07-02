import React, { useEffect, useState, useMemo } from 'react';
import { companyEmployee } from '../../../api/company';
import ReusableTable from './ReusableTable';

const EmployeeApproveTable = ({ searchKeyword }) => {
  const [members, setMembers] = useState([]);

  const roleMap = {
    MASTER: '대표',
    MANAGER: '매니저',
    EMPLOYEE: '사원',
  };

  const columns = useMemo(
    () => [
      { header: '부서', accessor: 'department' },
      { header: '직급', accessor: 'position' },
      { header: '이름', accessor: 'name' },
      { header: '성별', accessor: 'gender' },
      { header: '나이', accessor: 'age' },
      { header: '등급', accessor: 'role' },
      { header: '이메일', accessor: 'email' },
      { header: '전화번호', accessor: 'phone' },
      { header: '승인여부', accessor: 'actions' },
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
        const data = await companyEmployee.getEmployeeApprove(2);

        const formatted = data.map((member) => ({
          user_no: member.user_no,
          department: member.department_name,
          position: member.position,
          name: member.name,
          gender: member.gender === 'M' ? '남성' : '여성',
          age: member.age,
          role: roleMap[member.role] || member.role,
          email: member.company_email,
          phone: member.phone,
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

export default EmployeeApproveTable;
