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

const MemberTable = () => {
  const [members, setMembers] = useState([]);
  const columns = [
    { header: '부서', accessor: 'department' },
    { header: '직급', accessor: 'position' },
    { header: '이름', accessor: 'name' },
    { header: '성별', accessor: 'gender' },
    { header: '나이', accessor: 'age' },
    { header: '등급', accessor: 'level' },
    { header: '이메일', accessor: 'email' },
    { header: '근무 현황', accessor: 'status' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersRes, profilesRes] = await Promise.all([
          axios.get('http://localhost:3001/member'),
          axios.get('http://localhost:3001/company_profile'),
        ]);

        const memberData = membersRes.data;
        const profileData = profilesRes.data;

        // user_no 기준으로 member + profile 매칭
        const merged = memberData.map((member) => {
          const profile = profileData.find((p) => p.user_no === member.user_no);

          return {
            name: member.name,
            email: member.email,
            gender: member.gender === 'M' ? '남성' : '여성',
            age: calculateAge(member.birthday),
            department: profile?.department || '정보 없음',
            position: profile?.position || '정보 없음',
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
