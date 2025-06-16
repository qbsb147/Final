import React, { useState } from 'react';
import ReusableTable from './ReusableTable';

const MemberTable = () => {
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

  const [members, setMembers] = useState([  
    {
      department: '기술팀',
      position: '팀장',
      name: '홍길동',
      gender: '남성',
      age: 30,
      level: '총 책임자',
      email: 'master@email.com',
      status: '근무중',
    },
  ]);

  const handleLevelChange = (index, newLevel) => {
    const oldLevel = members[index].level;

    if (oldLevel === newLevel) return; // 변경이 없으면 무시

    const isConfirmed = window.confirm(`[${oldLevel}] → [${newLevel}] 로 변경하시겠습니까?`);
    if (!isConfirmed) return;

    const updated = [...members];
    updated[index].level = newLevel;
    setMembers(updated);
  };

  return <ReusableTable columns={columns} data={members} onLevelChange={handleLevelChange} />;
};

export default MemberTable;