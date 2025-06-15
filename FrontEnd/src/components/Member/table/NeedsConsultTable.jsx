import React from 'react';
import ReusableTable from './ReusableTable';

const NeedsConsultTable = () => {
  const columns = [
    { header: '부서', accessor: 'department' },
    { header: '직급', accessor: 'position' },
    { header: '이름', accessor: 'name' },
    { header: '성별', accessor: 'gender' },
    { header: '나이', accessor: 'age' },
    { header: '이메일', accessor: 'email' },
    { header: '근무 현황', accessor: 'status' },
    { header: '심리 상태', accessor: 'psychologicalStatus' },
  ];

  const data = [
    {
      department: '기술팀',
      position: '팀장',
      name: '홍길동',
      gender: '남성',
      age: 30,
      email: 'master@email.com',
      status: '출근',
      psychologicalStatus: '불안',
    },
  ];

  return <ReusableTable columns={columns} data={data} />;
};

export default NeedsConsultTable;