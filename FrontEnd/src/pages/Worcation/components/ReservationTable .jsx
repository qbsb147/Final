import React, { useEffect, useState, useMemo } from 'react';
import { worcationService } from '../../../api/worcations.js';
import ReusableTable from '../../member/components/table/ReusableTable.jsx';
import styled from 'styled-components';
import Pagination from '../../../components/common/Pagination';
import useAuthStore from '../../../store/authStore.js';

const ReservationTable = ({ searchKeyword, currentPage, setCurrentPage }) => {
  const [members, setMembers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const { loginUser } = useAuthStore();

  const pageSize = 15;

  const columns = useMemo(
    () => [
      { header: '회사명', accessor: 'company_name' },
      { header: '이름', accessor: 'user_name' },
      { header: '워케이션명', accessor: 'worcation_name' },
      { header: '나이', accessor: 'age' },
      { header: '성별', accessor: 'gender' },
      { header: '전화번호', accessor: 'phone' },
      { header: '이메일', accessor: 'company_email' },
      { header: '예약일자', accessor: 'worcation_date' },
    ],
    []
  );

  const filteredMembers = useMemo(() => {
    let filtered = members;
    if (searchKeyword) {
      filtered = members.filter((m) => m.worcation_name.toLowerCase().includes(searchKeyword.toLowerCase()));
    }

    filtered.sort((a, b) => {
      const dateA = new Date(...a.update_at);
      const dateB = new Date(...b.update_at);
      return dateB - dateA; // 최신이 앞으로
    });

    return filtered;
  }, [members, searchKeyword]);

  useEffect(() => {
    if (!loginUser || !loginUser.user_no) return;
    const fetchData = async () => {
      try {
        const data = await worcationService.WorcationReservation(loginUser.user_no, currentPage, pageSize);
        console.log(data);
        setMembers(data.content);
        setTotalPages(data.total_page);
      } catch (error) {
        console.error('예약자 목록 로딩 실패:', error);
      }
    };

    fetchData();
  }, [loginUser?.user_no, currentPage]);

  // use shared Pagination component (props passed from parent)

  return (
    <>
      <ReusableTable columns={columns} data={filteredMembers} messageWhenEmpty="예약자가 없습니다." />

      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </>
  );
};

/* Pagination replaced by shared component */

export default ReservationTable;
