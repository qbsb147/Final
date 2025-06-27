import React, { useState } from 'react';
import styled from 'styled-components';
import { InputLightGray } from '../../../../styles/Input.styles.js';
import CustomSelect from '../../../../components/common/Select.jsx';
import NumberInput from '../../../../components/common/NumberInput.jsx';
import CustomTextArea from '../../../../components/common/TextArea.jsx';
import { ButtonBorder } from '../../../../styles/Button.styles.js';

const Form = () => {
  const [theme, setTheme] = useState('');
  const [maxPeople, setMaxPeople] = useState('');
  const [phone, setPhone] = useState('');
  const [price, setPrice] = useState('');
  const [policy, setPolicy] = useState('');

  const themeOptions = [
    { value: 'modern', label: '모던 스타일' },
    { value: 'classic', label: '클래식' },
    { value: 'industrial', label: '인더스트리얼' },
    { value: 'minimal', label: '미니멀' },
    { value: 'natural', label: '내추럴' },
  ];

  return (
    <Body>
      <Title>기본 정보를 입력해주세요.</Title>
      <Table>
        <TBody>
          <TR>
            <TH>업체 테마</TH>
            <TD>
              <CustomSelect options={themeOptions} value={theme} onChange={(e) => setTheme(e.target.value)} />
            </TD>
          </TR>
          <TR>
            <TH>최대 인원</TH>
            <TD>
              <NumberInput value={maxPeople} onChange={setMaxPeople} format={false} />
            </TD>
          </TR>
          <TR>
            <TH>연락처</TH>
            <TD>
              <InputLightGray
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="연락처를 입력해주세요"
              />
            </TD>
          </TR>
          <TR>
            <TH>비제휴 가격</TH>
            <TD>
              <NumberInput value={price} onChange={setPrice} format={true} />
            </TD>
          </TR>
          <TR>
            <TH>제휴 정책</TH>
            <TD>
              <CustomTextArea value={policy} onChange={(e) => setPolicy(e.target.value)} rows={3} />
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
  display: flex;
  align-items: center;
  text-align: left;
  width: 200px;
  font-weight: 500;
`;

const TD = styled.td`
  display: flex;
`;

const ButtonYellow = styled(ButtonBorder)`
  height: 30px;
  font-size: ${({ theme }) => theme.fontSizes.base};
  margin-left: 50px;
`;
