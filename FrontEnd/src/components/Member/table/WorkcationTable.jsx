import React from 'react';
import ReusableTable from './ReusableTable';

const WorkcationTable = () => {
    const columns = [
        { header: '부서', accessor: 'department' },
        { header: '직급', accessor: 'position' },
        { header: '이름', accessor: 'name' },
        { header: '성별', accessor: 'gender' },
        { header: '나이', accessor: 'age' },
        { header: '이메일', accessor: 'email' },
        { header: '신청 기간', accessor: 'period' },
        { header: '워케이션 장소', accessor: 'location' },
        { header: '심리 상태', accessor: 'psychologicalStatus' },
        { header: '승인 여부', accessor: 'actions' },
    ];

  const data = [
    {
        department: '기술팀',
        position: '사원',
        name: '홍길동',
        gender: '남성',
        age: 26,
        email: 'email@email.com',
        period: '2025.06.01 ~ 2025.06.30',
        location: '포포인츠 알파이 워케이션',
        psychologicalStatus: '불안',
    },
  ];

  return (
    <ReusableTable
      columns={columns}
      data={data}
      onApprove={(row) => console.log('승인', row)}
      onReject={(row) => console.log('거부', row)}
    />
  );
};

export default WorkcationTable;