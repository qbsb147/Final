import React from 'react';
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

  const data = [
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
  ];

  return <ReusableTable columns={columns} data={data} />;
};

export default MemberTable;