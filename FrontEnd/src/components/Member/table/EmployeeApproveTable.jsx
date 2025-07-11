import React, { useEffect, useState, useMemo } from 'react';
import { companyEmployee } from '../../../api/company';
import ReusableTable from './ReusableTable';
import useAuthStore from '../../../store/authStore';
import Swal from 'sweetalert2';
import SwalStyles from '../../../styles/SwalStyles';

const EmployeeApproveTable = ({ searchKeyword }) => {
  const [members, setMembers] = useState([]);
  const { loginUser } = useAuthStore();

  const handleApprove = async (row) => {
    const result = await Swal.fire({
      title: '승인 요청',
      text: `${row.name}님을 승인하시겠습니까?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '승인',
      cancelButtonText: '취소',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });

    if (!result.isConfirmed) return;

    try {
      await companyEmployee.UpdateApproveCheck(row.user_no, 'Y');
      Swal.fire({
        icon: 'success',
        title: '승인 완료',
        text: `${row.name}님이 승인되었습니다.`,
        timer: 1500,
        showConfirmButton: false,
      });

      setMembers((prev) => prev.filter((member) => member.user_no !== row.user_no));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: error.message || '승인 처리 중 문제가 발생했습니다.',
      });
    }
  };

  const handleReject = async (row) => {
    const result = await Swal.fire({
      title: '거부 요청',
      text: `${row.name}님을 거부하시겠습니까?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '거부',
      cancelButtonText: '취소',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#999',
    });

    if (!result.isConfirmed) return;

    try {
      await companyEmployee.UpdateApproveCheck(row.user_no, 'N');
      Swal.fire({
        icon: 'success',
        title: '거부 완료',
        text: `${row.name}님이 거부되었습니다.`,
        timer: 1500,
        showConfirmButton: false,
      });

      setMembers((prev) => prev.filter((member) => member.user_no !== row.user_no));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: error.message || '거부 처리 중 문제가 발생했습니다.',
      });
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
    if (!loginUser) return;
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
  }, [loginUser]);

  return (
    <>
      <SwalStyles />
      <ReusableTable columns={columns} data={filteredMembers} onApprove={handleApprove} onReject={handleReject} />
    </>
  );
};

export default EmployeeApproveTable;
