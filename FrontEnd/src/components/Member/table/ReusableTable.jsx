import React from 'react';
import styled from 'styled-components';

/**
 * 재사용 가능한 테이블 컴포넌트
 * @param {Array} columns - 테이블의 열 정보를 담은 배열. { header: '표시 이름', accessor: '데이터 키' } 형태
 * @param {Array} data - 테이블에 표시할 데이터 배열.
 * @param {Function} onApprove - 승인 버튼 클릭 시 실행될 콜백 함수.
 * @param {Function} onReject - 거부 버튼 클릭 시 실행될 콜백 함수.
 * @param {Function} onLevelChange - 등급 변경 시 호출될 콜백 함수 (rowIndex, newValue)
 */

const ReusableTable = ({ columns, data, onApprove, onReject, onLevelChange  }) => {
  return (
    <TableWrap>
      <thead>
        <tr>
          {columns.map((col) => (
            <Th key={col.accessor}>{col.header}</Th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((col) => (
              <Td key={col.accessor}>
                {col.accessor === 'actions' ? (
                  <ButtonWrap>
                    <ApproveBtn onClick={() => onApprove?.(row)}>승인</ApproveBtn>
                    <RejectBtn onClick={() => onReject?.(row)}>거부</RejectBtn>
                  </ButtonWrap>
                ) : col.accessor === 'level' ? (
                  <Select
                    value={row.level}
                    onChange={(e) => onLevelChange?.(rowIndex, e.target.value)}
                  >
                    <option value="총관리자">총관리자</option>
                    <option value="관리자">관리자</option>
                    <option value="직원">직원</option>
                  </Select>
                ) : (
                  row[col.accessor]
                )}
              </Td>
            ))}
          </tr>
        ))}
      </tbody>
    </TableWrap>
  );
};

export default ReusableTable;

// 스타일 정의
const TableWrap = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-shadow: ${({ theme }) => theme.shadows.md};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  overflow: hidden;
`;

const Th = styled.th`
  padding: 4px;
  background-color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.base};
`;

const Td = styled.td`
  padding: 4px;
  font-size: ${({ theme }) => theme.fontSizes.base};
  border-bottom: 1px solid #eee;
`;

const ButtonWrap = styled.div`
  display: flex;
  gap: 4px;
  justify-content: center;
`;

const ApproveBtn = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: black;
  padding: 4px 10px;
  border-radius: 8px;
  border: none;
  font-weight: bold;
`;

const RejectBtn = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: black;
  padding: 4px 10px;
  border-radius: 8px;
  border: none;
  font-weight: bold;
`;

const Select = styled.select`
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
  border: none;
  font-weight: bold;
  text-align: center;
  text-align-last: center;
`;