import React, { useEffect, useState, useMemo } from 'react';
import { companyEmployee } from '../../../api/company';
import ReusableTable from './ReusableTable';

const WorcationTable = ({ searchKeyword }) => {
  const [members, setMembers] = useState([]);

  const handleApprove = async (row) => {
    if (!window.confirm(`${row.name}님의 워케이션을 승인하시겠습니까?`)) return;

    try {
      await companyEmployee.UpdateWorcationCheck(row.user_no, 'Y');
      alert('승인 완료');

      setMembers((prev) => prev.filter((member) => member.user_no !== row.user_no));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleReject = async (row) => {
    if (!window.confirm(`${row.name}님의 워케이션을 거부하시겠습니까?`)) return;

    try {
      await companyEmployee.UpdateWorcationCheck(row.user_no, 'N');
      alert('거부 완료');

      setMembers((prev) => prev.filter((member) => member.user_no !== row.user_no));
    } catch (error) {
      alert(error.message);
    }
  };

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
      { header: '승인 여부', accessor: 'actions' },
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
        const data = await companyEmployee.getWorcationApplies(1);
        console.log('승인 대기 멤버 데이터:', data);
        const formatted = data.map((member) => ({
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
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      }
    };

    fetchData();
  }, []);

  return <ReusableTable columns={columns} data={filteredMembers} onApprove={handleApprove} onReject={handleReject} />;
};

export default WorcationTable;
