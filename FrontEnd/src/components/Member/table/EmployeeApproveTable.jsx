import React, { useEffect, useState, useMemo } from 'react';
import { companyEmployee } from '../../../api/company';
import ReusableTable from './ReusableTable';
import useAuthStore from '../../../store/authStore';

const EmployeeApproveTable = ({ searchKeyword }) => {
  const [members, setMembers] = useState([]);
  const { loginUser } = useAuthStore();

  const handleApprove = async (row) => {
    if (!window.confirm(`${row.name}님을 승인하시겠습니까?`)) return;

    try {
      await companyEmployee.UpdateApproveCheck(row.user_no, 'Y');
      alert('승인 완료');

      setMembers((prev) => prev.filter((member) => member.user_no !== row.user_no));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleReject = async (row) => {
    if (!window.confirm(`${row.name}님을 거부하시겠습니까?`)) return;

    try {
      await companyEmployee.UpdateApproveCheck(row.user_no, 'N');
      alert('거부 완료');

      setMembers((prev) => prev.filter((member) => member.user_no !== row.user_no));
    } catch (error) {
      alert(error.message);
    }
  };

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
        const data = await companyEmployee.getEmployeeApprove(loginUser.company_no);
        console.log('승인 대기 멤버 데이터:', data);
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

  return <ReusableTable columns={columns} data={filteredMembers} onApprove={handleApprove} onReject={handleReject} />;
};

export default EmployeeApproveTable;
