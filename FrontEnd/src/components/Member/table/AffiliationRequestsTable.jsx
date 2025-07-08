import React, { useEffect, useState } from 'react';
import ReusableTable from './ReusableTable';
import { partnerService } from '../../../api/partner';

const WorkcationTable = ({ user_no }) => {
  const [data, setData] = useState([]);

  // 백엔드에서 데이터 불러오기
  const fetchData = async () => {
    try {
      const response = await partnerService.getAllRequests(user_no);
      const formattedData = response.map((item) => ({
        partner_no: item.partner_no,
        company_name: item.company_name,
        name: item.licensee,
        personnel: item.company_people,
        phone: item.company_tel,
        email: item.company_email,
        TIN: item.business_id,
        period: `${item.start_date} ~ ${item.end_date}`,
        actions: item.approve,
      }));
      setData(formattedData);
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { header: '번호', accessor: 'partner_no' },
    { header: '기업명', accessor: 'company_name' },
    { header: '사업자명', accessor: 'name' },
    { header: '인원', accessor: 'personnel' },
    { header: '연락처', accessor: 'phone' },
    { header: '이메일', accessor: 'email' },
    { header: '사업자번호', accessor: 'TIN' },
    { header: '기간', accessor: 'period' },
    { header: '승인 여부', accessor: 'actions' },
  ];

  const handleApprove = async (row) => {
    try {
      await partnerService.approve(row.partner_no); // 승인 API 호출
      alert('승인되었습니다.');
      fetchData();
    } catch (error) {
      console.error('승인 실패:', error);
      alert('승인 중 오류가 발생했습니다.');
    }
  };

  const handleReject = async (row) => {
    try {
      await partnerService.reject(row.partner_no); // 거절 API 호출
      alert('거절되었습니다.');
      // 목록 다시 불러오기
      fetchData();
    } catch (error) {
      console.error('거절 실패:', error);
      alert('거절 중 오류가 발생했습니다.');
    }
  };
  return <ReusableTable columns={columns} data={data} onApprove={handleApprove} onReject={handleReject} />;
};

export default WorkcationTable;
