import React from 'react';
import styled from 'styled-components';
import { InputLightGray } from '../../../styles/Input.styles';

const Form = () => {
  return (
    <Body>
      <Title>호스트 신청을 완료해주세요.</Title>
      <Table>
        <TBody>
          <TR>
            <TH>업체 유형</TH>
            <TD>
              <InputLightGray />
            </TD>
          </TR>
          <TR>
            <TH>업체 유형</TH>
            <TD>
              <InputLightGray />
            </TD>
          </TR>
          <TR>
            <TH>업체 유형</TH>
            <TD>
              <InputLightGray />
            </TD>
          </TR>
          <TR>
            <TH>업체 유형</TH>
            <TD>
              <InputLightGray />
            </TD>
          </TR>
          <TR>
            <TH>업체 유형</TH>
            <TD>
              <InputLightGray />
            </TD>
          </TR>
        </TBody>
      </Table>
    </Body>
  );
};

export default Form;

const Body = styled.div`
  gap: 40px;
  padding: 40px;
  width: 1008px;
  height: 562px;
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
`;

const Title = styled.div`
  text-align: start;
`;

const Table = styled.table`
  width: 100%;
  border-spacing: 16px 12px; /* 셀 간격 조정 */
`;
const TBody = styled.tbody`
  display: flex;
  flex-direction: column;
  gap: 42px;
`;

const TR = styled.tr`
  vertical-align: middle;
  display: flex;
`;

const TH = styled.th`
  text-align: left;
  vertical-align: middle;
  width: 200px;
  font-weight: 500;
`;

const TD = styled.td`
  display: flex;
`;
