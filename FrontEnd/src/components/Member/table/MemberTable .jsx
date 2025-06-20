import React, { useEffect, useState, useMemo } from 'react';
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

const formatDate = (date) => date.toISOString().split('T')[0];

const MemberTable = ({ searchKeyword }) => {
  const [members, setMembers] = useState([]);

  const roleMap = {
    master: '대표',
    manager: '매니저',
    worcation: '워케이션 업체',
    employee: '직원',
    admin: '홈페이지 관리자',
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
          const currentRole = currentMember.role; // role key ('master', 'manager', ...)
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
              await axios.patch(`http://localhost:3001/member/${currentMember.user_no}`, {
                role: newRoleKey,
              });

              setMembers((prev) =>
                prev.map((m) => (m.user_no === currentMember.user_no ? { ...m, role: newRoleKey } : m))
              );
            } catch (err) {
              alert('등급 변경에 실패했습니다.');
              console.error(err);
              e.target.value = currentRole;
            }
          };

          return (
            <select value={currentRole} onChange={handleChange}>
              {Object.entries(roleMap).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          );
        },
      },
      { header: '이메일', accessor: 'email' },
      { header: '근무 현황', accessor: 'status' },
    ],
    [members]
  );

  // 검색어에 따른 필터링된 멤버 목록
  const filteredMembers = useMemo(() => {
    if (!searchKeyword) return members;
    return members.filter((m) => m.name.toLowerCase().includes(searchKeyword.toLowerCase()));
  }, [members, searchKeyword]);

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
          const userApplications = applicationData
            .filter((app) => app.ref_member_no === member.user_no && app.approve === 'Y')
            .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

          const currentApplication = userApplications.find((app) => {
            const start = formatDate(new Date(app.start_date));
            const end = formatDate(new Date(app.end_date));
            return todayStr >= start && todayStr <= end;
          });

          const status = currentApplication ? '워케이션 중' : '근무 중';

          return {
            user_no: member.user_no,
            department: profile?.department || '정보 없음',
            position: profile?.position || '정보 없음',
            name: member.name,
            gender: member.gender === 'M' ? '남성' : '여성',
            age: calculateAge(member.birthday),
            role: member.role, // role key로 저장
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

  return <ReusableTable columns={columns} data={filteredMembers} />;
};

export default MemberTable;
