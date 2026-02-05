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

const ReusableTable = ({ columns, data, onApprove, onReject, messageWhenEmpty }) => {
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
        {data.length === 0 ? (
          <tr>
            <Td colSpan={columns.length} style={{ textAlign: 'center', padding: '12px', fontWeight: 'bold' }}>
              {messageWhenEmpty || '직원이 없습니다.'}
            </Td>
          </tr>
        ) : (
          data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <Td key={col.accessor}>
                  {col.Cell ? (
                    col.Cell({ rowIndex, row })
                  ) : col.accessor === 'actions' ? (
                    <ButtonWrap>
                      <ApproveBtn onClick={() => onApprove?.(row)}>승인</ApproveBtn>
                      <RejectBtn onClick={() => onReject?.(row)}>거부</RejectBtn>
                    </ButtonWrap>
                  ) : (
                    row[col.accessor]
                  )}
                </Td>
              ))}
            </tr>
          ))
        )}
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
  min-width: 60px;
`;

const Td = styled.td`
  padding: 4px;
  font-size: ${({ theme }) => theme.fontSizes.base};
  border-bottom: 1px solid #eee;
  &:nth-child(1) {
    width: 80px;
  }
  &:nth-child(2) {
    width: 80px;
  }
  &:nth-child(3) {
    width: 100px;
  }
  &:nth-child(4) {
    width: 60px;
  }
  &:nth-child(5) {
    width: 80px;
  }
  &:nth-child(6) {
    width: 220px;
  }
  &:nth-child(7) {
    width: 250px;
  }
  &:nth-child(8) {
    width: 200px;
  }
  &:nth-child(9) {
    width: 120px;
  }

  white-space: nowrap; /* 줄바꿈 방지 */
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
