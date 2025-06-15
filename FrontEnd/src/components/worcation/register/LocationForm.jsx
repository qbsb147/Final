import React, { useState } from 'react';
import styled from 'styled-components';
import { InputLightGray } from '../../../styles/Input.styles';
import RadioButton from '../../common/RadioButton';
import CustomDatePicker from '../../common/DatePicker';
import { ButtonBorder, ButtonYb } from '../../../styles/Button.styles';

const Form = () => {
  const [selected, setSelected] = useState('Office');
  const [startDate, setStartDate] = useState(null);

  const radioOptions = [
    { value: 'Office', label: '오피스' },
    { value: 'Accommodation', label: '숙박' },
    { value: 'OfficeAndStay', label: '오피스&숙박' },
  ];

  return (
    <Body>
      <Title>호스트 신청을 완료해주세요.</Title>
      <Table>
        <TBody>
          <TR>
            <TH>업체 유형</TH>
            <TD>
              <RadioButton options={radioOptions} selected={selected} onChange={setSelected} />
            </TD>
          </TR>
          <TR>
            <TH>사업자명</TH>
            <TD>
              <InputLightGray />
            </TD>
          </TR>
          <TR>
            <TH>상호명</TH>
            <TD>
              <InputLightGray />
            </TD>
          </TR>
          <TR>
            <TH>개업일</TH>
            <TD>
              <CustomDatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
            </TD>
          </TR>
          <TR>
            <TH>사업자등록번호</TH>
            <TD>
              <InputLightGray />
            </TD>
            <TD>
              <ButtonYellow>진위확인</ButtonYellow>
            </TD>
          </TR>
        </TBody>
      </Table>
    </Body>
  );
};

export default Form;

const ButtonYellow = styled(ButtonBorder)`
  height: 30px;
  font-size: ${({ theme }) => theme.fontSizes.base};
  margin-left: 50px;
`;

const Body = styled.div`
  gap: 40px;
  padding: 40px;
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
