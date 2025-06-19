import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReusableTable from './ReusableTable';

const calculateAge = (birthday) => {
  const birthDate = new Date(birthday);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const isBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!isBirthdayPassed) {
    age--;
  }

  return age;
};

// 날짜를 'YYYY-MM-DD' 형식으로 비교
const formatDate = (date) => date.toISOString().split('T')[0];

const MemberTable = () => {
  const [members, setMembers] = useState([]);
  const columns = [
    { header: '부서', accessor: 'department' },
    { header: '직급', accessor: 'position' },
    { header: '이름', accessor: 'name' },
    { header: '성별', accessor: 'gender' },
    { header: '나이', accessor: 'age' },
    { header: '등급', accessor: 'role' },
    { header: '이메일', accessor: 'email' },
    { header: '근무 현황', accessor: 'status' },
  ];

  const roleMap = {
    master: '대표',
    manager: '매니저',
    worcation: '워케이션 업체',
    employee: '직원',
    admin: '홈페이지 관리자',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersRes, profilesRes, applicationsRes] = await Promise.all([
          axios.get('http://localhost:3001/member'),
          axios.get('http://localhost:3001/company_profile'),
          axios.get('http://localhost:3001/worcation_application'),
        ]);

        const memberData = membersRes.data;
        const profileData = profilesRes.data;
        const applicationData = applicationsRes.data;

        const today = new Date();
        const todayStr = formatDate(today);

        const merged = memberData.map((member) => {
          const profile = profileData.find((p) => p.user_no === member.user_no);

          // 승인된 신청 중 해당 유저의 것만 필터
          const userApplications = applicationData
            .filter((app) => app.ref_member_no === member.user_no && app.approve === 'Y')
            .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

          // 오늘 날짜가 포함되는 가장 가까운 일정 하나 찾기
          const currentApplication = userApplications.find((app) => {
            const start = formatDate(new Date(app.start_date));
            const end = formatDate(new Date(app.end_date));
            return todayStr >= start && todayStr <= end;
          });

          const status = currentApplication ? '워케이션 중' : '근무 중';

          return {
            department: profile?.department || '정보 없음',
            position: profile?.position || '정보 없음',
            name: member.name,
            gender: member.gender === 'M' ? '남성' : '여성',
            age: calculateAge(member.birthday),
            role: roleMap[member.role] || '정보 없음',
            email: member.email,
            status,
          };
        });

        setMembers(merged);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      }
    };

    fetchData();
  }, []);

  return <ReusableTable columns={columns} data={members} />;
};

export default MemberTable;
