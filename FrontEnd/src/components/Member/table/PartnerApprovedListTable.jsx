import React from 'react';
import ReusableTable from './ReusableTable';

const PartnerApprovedListTable = () => {
  const columns = [
    { header: '번호', accessor: 'No' },
    { header: '기업명', accessor: 'CompanyName' },
    { header: '사업자명', accessor: 'name' },
    { header: '인원', accessor: 'personnel' },
    { header: '연락처', accessor: 'phone' },
    { header: '이메일', accessor: 'email' },
    { header: '사업자번호', accessor: 'TIN' },
    { header: '기간', accessor: 'period' },
    { header: '승인 여부', accessor: 'status' },
  ];

  const data = [
    {
      No: '1',
      CompanyName: 'KH',
      name: '홍딜동',
      personnel: '8',
      phone: '010-0000-0000',
      email: 'email.eamil.com',
      TIN: '00-0000-00-0000',
      period: '3개월',
      status: '승인',
    },
  ];

  return <ReusableTable columns={columns} data={data} />;
};

export default PartnerApprovedListTable;
