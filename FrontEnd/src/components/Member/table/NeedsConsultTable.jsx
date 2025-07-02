import React, { useState, useEffect, useMemo } from 'react';
import ReusableTable from './ReusableTable'; // 테이블 컴포넌트 경로에 맞게 수정
import { companyEmployee } from '../../../api/company'; // 경로 맞게 조정

const NeedsConsultTable = ({ searchKeyword }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // 로그인되면 companyNo를 props나 context 등으로 대체할 예정
  const companyNo = 3;
  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const result = await companyEmployee.getneedsConsult(companyNo);

        // 성별 및 심리상태 한글 변환
        const genderMap = {
          M: '남성',
          W: '여성',
        };

        const stateMap = {
          Severe: '심각',
          Critical: '위급',
        };

        const translated = result.map((item) => ({
          ...item,
          gender: genderMap[item.gender] || item.gender,
          psychological_state: stateMap[item.psychological_state] || item.psychological_state,
        }));

        setData(translated);
      } catch (err) {
        setError(err.message || '데이터를 불러오는데 실패했습니다.');
      }
    };

    fetchData();
  }, [companyNo]);

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

  // 빈 데이터 메시지 조건 분기
  const emptyMessage =
    filteredData.length === 0
      ? searchKeyword && data.length > 0
        ? '직원이 없습니다.'
        : '직원들의 심리 상태가 좋습니다.'
      : '';

  if (error) return <div>{error}</div>;

  return <ReusableTable columns={columns} data={filteredData} messageWhenEmpty={emptyMessage} />;
};

export default NeedsConsultTable;
