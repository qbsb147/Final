import React from 'react';
import styled from 'styled-components';
import { InputLightGray } from '../../../../styles/Input.styles';
import CustomSelect from '../../../../components/common/Select';
import NumberInput from '../../../common/NumberInput';
import CustomTextArea from '../../../common/TextArea';
import { ButtonBorder } from '../../../../styles/Button.styles';
import useWorcationStore from '../../../../store/useWorcationStore';

// const Form = () => {
//   const [theme, setTheme] = useState('');
//   const [maxPeople, setMaxPeople] = useState('');
//   const [phone, setPhone] = useState('');
//   const [price, setPrice] = useState('');
//   const [policy, setPolicy] = useState('');

//   const themeOptions = [
//     { value: 'modern', label: '모던 스타일' },
//     { value: 'classic', label: '클래식' },
//     { value: 'industrial', label: '인더스트리얼' },
//     { value: 'minimal', label: '미니멀' },
//     { value: 'natural', label: '내추럴' },
//   ];
const Form = () => {
  const info = useWorcationStore((state) => state.info);
  const setInfo = useWorcationStore((state) => state.setInfo);

  const themeOptions = [
    { value: 'modern', label: '모던' },
    { value: 'eco_friendly', label: '에코 프렌들리' },
    { value: 'quiet', label: '조용한 분위기' },
    { value: 'urban_nature', label: '도심 속 자연' },
    { value: 'camping', label: '캠핑 스타일' },
  ];
  return (
    <Body>
      <Title>기본 정보를 입력해주세요.</Title>
      <Table>
        <TBody>
          <TR>
            <TH>업체 테마</TH>
            <TD>
              <CustomSelect
                options={themeOptions}
                value={info.theme}
                onChange={(e) => setInfo({ theme: e.target.value })}
                // onChange={(e) => setTheme(e.target.value)}
              />
            </TD>
          </TR>
          <TR>
            <TH>최대 인원</TH>
            <TD>
              <NumberInput
                value={info.maxPeople}
                // onChange={setMaxPeople}
                onChange={(val) => setInfo({ maxPeople: val })}
                format={false}
              />
            </TD>
          </TR>
          <TR>
            <TH>연락처</TH>
            <TD>
              <InputLightGray
                value={info.phone}
                onChange={(e) => setInfo({ phone: e.target.value })}
                placeholder="연락처를 입력해주세요"
              />
            </TD>
          </TR>
          <TR>
            <TH>비제휴 가격</TH>
            <TD>
              <NumberInput
                value={info.nonPartnerPrice}
                // onChange={setPrice}
                onChange={(val) => setInfo({ nonPartnerPrice: val })}
                format={true}
              />
            </TD>
          </TR>
          <TR>
            <TH>제휴 가격</TH>
            <TD>
              <NumberInput
                value={info.partnerPrice}
                // onChange={(e) => setPolicy(e.target.value)}
                onChange={(val) => setInfo({ partnerPrice: val })}
                format={true}
              />
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
