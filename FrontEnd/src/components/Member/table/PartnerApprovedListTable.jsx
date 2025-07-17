import React, { useEffect, useState } from 'react';
import ReusableTable from './ReusableTable';
import { partnerService } from '../../../api/partner';
import useAuthStore from '../../../store/authStore';
const PartnerApprovedListTable = () => {
  const loginUser = useAuthStore((state) => state.loginUser);
  const user_no = loginUser?.user_no;
  const [data, setData] = useState([]);

  // 백엔드에서 데이터 불러오기
  const fetchData = async () => {
    try {
      const response = await partnerService.getApprovalRequests(user_no);
      const formattedData = response.map((item) => ({
        partner_no: item.partner_no,
        company_name: item.company_name,
        name: item.licensee,
        personnel: item.company_people,
        phone: item.company_tel,
        email: item.company_email,
        TIN: item.business_id,
        period: `${item.start_date} ~ ${item.end_date}`,
        text: '승인',
      }));
      setData(formattedData);
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    }
  };

  useEffect(() => {
    if (!user_no) return;
    fetchData();
  }, [user_no]);

  const columns = [
    { header: '번호', accessor: 'partner_no' },
    { header: '기업명', accessor: 'company_name' },
    { header: '사업자명', accessor: 'name' },
    { header: '인원', accessor: 'personnel' },
    { header: '연락처', accessor: 'phone' },
    { header: '이메일', accessor: 'email' },
    { header: '사업자번호', accessor: 'TIN' },
    { header: '기간', accessor: 'period' },
    { header: '승인 여부', accessor: 'text' },
  ];

  return <ReusableTable columns={columns} data={data} />;
};

export default PartnerApprovedListTable;
