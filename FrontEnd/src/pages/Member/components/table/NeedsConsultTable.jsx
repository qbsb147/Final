import React, { useState, useEffect, useMemo } from 'react';
import ReusableTable from './ReusableTable.jsx';
import { companyEmployee } from '../../../../api/company.js';
import styled from 'styled-components';
import Pagination from '../../../../components/common/Pagination';
import useAuthStore from '../../../../store/authStore.js';

const NeedsConsultTable = ({ searchKeyword, currentPage, setCurrentPage }) => {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const { loginUser } = useAuthStore();
  const pageSize = 15;

  // searchKeyword 바뀌면 페이지 초기화
  useEffect(() => {
    setCurrentPage(0);
  }, [searchKeyword]);

  useEffect(() => {
    if (!loginUser?.company_no) return;

    const fetchData = async () => {
      setError(null);
      try {
        // 페이지 정보 포함해서 API 호출
        const result = await companyEmployee.getneedsConsult(loginUser.company_no, currentPage, pageSize);

        const genderMap = { M: '남성', W: '여성' };
        const stateMap = { Severe: '심각', Critical: '위급' };

        // API 응답이 { content: [], totalPages: n } 형태라 가정
        const dataArray = Array.isArray(result) ? result : result.content || [];

        const translated = dataArray.map((item) => ({
          ...item,
          gender: genderMap[item.gender] || item.gender,
          psychological_state: stateMap[item.psychological_state] || item.psychological_state,
        }));

        setData(translated);
        setTotalPages(result.totalPages || 1); // 총 페이지 수 세팅
      } catch (err) {
        setError(err.message || '데이터를 불러오는데 실패했습니다.');
      }
    };

    fetchData();
  }, [loginUser?.company_no, currentPage, pageSize]);

  const columns = useMemo(
    () => [
      { header: '부서', accessor: 'department_name' },
      { header: '직책', accessor: 'position' },
      { header: '이름', accessor: 'name' },
      { header: '성별', accessor: 'gender' },
      { header: '나이', accessor: 'age' },
      { header: '이메일', accessor: 'company_email' },
      { header: '출근상태', accessor: 'work_status' },
      { header: '심리상태', accessor: 'psychological_state' },
    ],
    []
  );

  const filteredData = useMemo(() => {
    if (!searchKeyword) return data;
    return data.filter((item) =>
      Object.values(item).some((value) => value && value.toString().toLowerCase().includes(searchKeyword.toLowerCase()))
    );
  }, [data, searchKeyword]);

  const emptyMessage =
    filteredData.length === 0
      ? searchKeyword && data.length > 0
        ? '직원이 없습니다.'
        : '직원들의 심리 상태가 좋습니다.'
      : '';

  if (error) return <div>{error}</div>;

  // use shared Pagination component (props passed from parent)

  return (
    <>
      <ReusableTable columns={columns} data={filteredData} messageWhenEmpty={emptyMessage} />

      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </>
  );
};

/* Pagination replaced by shared component */

export default NeedsConsultTable;
