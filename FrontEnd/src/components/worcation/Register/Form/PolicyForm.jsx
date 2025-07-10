import React, { forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import CustomTextArea from '../../../common/TextArea.jsx';
import useWorcationStore from '../../../../store/useWorcationStore';

const PolicyForm = forwardRef((props, ref) => {
  // const [checkinPeriod, setCheckinPeriod] = useState('AM');
  // const [checkinHour, setCheckinHour] = useState('9');
  // const [checkinMinute, setCheckinMinute] = useState('00');
  // const [checkoutPeriod, setCheckoutPeriod] = useState('AM');
  // const [checkoutHour, setCheckoutHour] = useState('11');
  // const [checkoutMinute, setCheckoutMinute] = useState('00');

  // const [officeStartPeriod, setOfficeStartPeriod] = useState('AM');
  // const [officeStartHour, setOfficeStartHour] = useState('9');
  // const [officeStartMinute, setOfficeStartMinute] = useState('00');
  // const [officeEndPeriod, setOfficeEndPeriod] = useState('PM');
  // const [officeEndHour, setOfficeEndHour] = useState('6');
  // const [officeEndMinute, setOfficeEndMinute] = useState('00');

  const policy = useWorcationStore((state) => state.policy);
  const setPolicy = useWorcationStore((state) => state.setPolicy);

  useImperativeHandle(ref, () => ({})); // 필요시 getValues 등 추가 가능

  const handleChange = (field) => (e) => {
    setPolicy({ [field]: e.target.value });
  };
  return (
    <Body>
      <Title>예약시 적용되는 사항입니다.</Title>
      <Table>
        <TBody>
          <TR>
            <TH>체크인 시간</TH>
            <TD $wide>
              <TimeInputWrap>
                <HourInput
                  type="number"
                  min="1"
                  max="12"
                  // value={checkinHour}
                  // onChange={(e) => setCheckinHour(e.target.value)}
                  value={policy.checkinHour}
                  onChange={handleChange('checkinHour')}
                />
                <TimeSeparator>:</TimeSeparator>
                <MinuteInput
                  type="number"
                  min="0"
                  max="59"
                  // value={checkinMinute}
                  // onChange={(e) => setCheckinMinute(e.target.value)}
                  value={policy.checkinMinute}
                  onChange={handleChange('checkinMinute')}
                />
                {/* <Select value={checkinPeriod} onChange={(e) => setCheckinPeriod(e.target.value)}> */}{' '}
                <Select value={policy.checkinPeriod} onChange={handleChange('checkinPeriod')}>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </Select>
              </TimeInputWrap>
            </TD>
            <TH>오피스 시작</TH>
            <TD $wide>
              <TimeInputWrap>
                <HourInput
                  type="number"
                  min="1"
                  max="12"
                  // value={officeStartHour}
                  // onChange={(e) => setOfficeStartHour(e.target.value)}
                  value={policy.officeStartHour}
                  onChange={handleChange('officeStartHour')}
                />
                <TimeSeparator>:</TimeSeparator>
                <MinuteInput
                  type="number"
                  min="0"
                  max="59"
                  // value={officeStartMinute}
                  // onChange={(e) => setOfficeStartMinute(e.target.value)}
                  value={policy.officeStartMinute}
                  onChange={handleChange('officeStartMinute')}
                />
                {/* <Select value={officeStartPeriod} onChange={(e) => setOfficeStartPeriod(e.target.value)}> */}
                <Select value={policy.officeStartPeriod} onChange={handleChange('officeStartPeriod')}>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </Select>
              </TimeInputWrap>
            </TD>
            <TD $fromto>부터</TD>
          </TR>
          <TR>
            <TH>체크아웃 시간</TH>
            <TD $wide>
              <TimeInputWrap>
                <HourInput
                  type="number"
                  min="1"
                  max="12"
                  // value={checkoutHour}
                  // onChange={(e) => setCheckoutHour(e.target.value)}
                  value={policy.checkoutHour}
                  onChange={handleChange('checkoutHour')}
                />
                <TimeSeparator>:</TimeSeparator>
                <MinuteInput
                  type="number"
                  min="0"
                  max="59"
                  // value={checkoutMinute}
                  // onChange={(e) => setCheckoutMinute(e.target.value)}
                  value={policy.checkoutMinute}
                  onChange={handleChange('checkoutMinute')}
                />
                {/* <Select value={checkoutPeriod} onChange={(e) => setCheckoutPeriod(e.target.value)}> */}
                <Select value={policy.checkoutPeriod} onChange={handleChange('checkoutPeriod')}>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </Select>
              </TimeInputWrap>
            </TD>
            <TH>오피스 끝</TH>
            <TD $wide>
              <TimeInputWrap>
                <HourInput
                  type="number"
                  min="1"
                  max="12"
                  // value={officeEndHour}
                  // onChange={(e) => setOfficeEndHour(e.target.value)}
                  value={policy.officeEndHour}
                  onChange={handleChange('officeEndHour')}
                />
                <TimeSeparator>:</TimeSeparator>
                <MinuteInput
                  type="number"
                  min="0"
                  max="59"
                  // value={officeEndMinute}
                  // onChange={(e) => setOfficeEndMinute(e.target.value)}
                  value={policy.officeEndMinute}
                  onChange={handleChange('officeEndMinute')}
                />
                {/* <Select value={officeEndPeriod} onChange={(e) => setOfficeEndPeriod(e.target.value)}> */}
                <Select value={policy.officeEndPeriod} onChange={handleChange('officeEndPeriod')}>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </Select>
              </TimeInputWrap>
            </TD>
            <TD $fromto>까지</TD>
          </TR>
          <TR>
            <TH>환불 정책</TH>
            <TD colSpan={3} style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <CustomTextArea
                rows={7}
                value={policy.refundPolicy}
                onChange={handleChange('refundPolicy')}
                placeholder="표준 환불 정책 : 일반적인 5일 전 취소 (Moderate)
일반(Moderate)​: 체크인 5일 전까지 취소할 경우 전액 환불(수수료 포함)
게스트가 체크인 5일 전까지 예약을 취소한다면 수수료를 포함한 전액을 환불받을 수 있습니다.
체크인 5일 전 이후에서 체크인 하루 전까지 취소하는 경우 숙박비 50%가 호스트에게 지급됩니다. 호스트에게 지급되는 숙박료에 해당하는 서비스 수수료가 차감되고 환불됩니다.
그 후에 취소하는 경우, 이미 숙박한 일수와 하루치의 숙박비 전액 및 남은 숙박 일수에 대한 숙박비 50%가 호스트에게 지급됩니다."
              />
            </TD>
          </TR>
        </TBody>
      </Table>
    </Body>
  );
});

export default PolicyForm;

const Body = styled.div`
  gap: ${({ theme }) => theme.spacing.s8};
  padding: ${({ theme }) => theme.spacing.s10};
  height: 562px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
`;

const Title = styled.div`
  text-align: start;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-family: ${({ theme }) => theme.fontFamily.primary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.s4};
`;

const Table = styled.table`
  border-spacing: 0 ${({ theme }) => theme.spacing.s8};
  border-collapse: separate;
  table-layout: fixed;
`;
const TBody = styled.tbody`
  display: table-row-group;
`;

const TR = styled.tr`
  display: table-row;
  vertical-align: middle;
`;

const TH = styled.th`
  display: table-cell;
  text-align: left;
  vertical-align: middle;
  white-space: nowrap;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-family: ${({ theme }) => theme.fontFamily.primary};
  padding-right: ${({ theme }) => theme.spacing.s2};
  padding-top: ${({ theme }) => theme.spacing.s2};
  padding-bottom: ${({ theme }) => theme.spacing.s2};
`;

const TD = styled.td`
  display: table-cell;
  vertical-align: middle;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-family: ${({ theme }) => theme.fontFamily.primary};
  color: ${({ theme }) => theme.colors.black};
  padding-right: ${({ theme }) => theme.spacing.s2};
  padding-top: ${({ theme }) => theme.spacing.s2};
  padding-bottom: ${({ theme }) => theme.spacing.s2};
`;

const TimeInputWrap = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s2};
`;

const Select = styled.select`
  height: ${({ theme }) => theme.heightes.input};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  border: 1.5px solid ${({ theme }) => theme.colors.gray[300]};
  padding: 0 ${({ theme }) => theme.spacing.s2};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-family: ${({ theme }) => theme.fontFamily.primary};
  color: ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.white};
`;

const HourInput = styled.input`
  height: ${({ theme }) => theme.heightes.input};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  border: 1.5px solid ${({ theme }) => theme.colors.gray[300]};
  padding: 0 ${({ theme }) => theme.spacing.s2};
  text-align: right;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-family: ${({ theme }) => theme.fontFamily.primary};
  color: ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.white};
`;

const MinuteInput = styled(HourInput)``;

const TimeSeparator = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-family: ${({ theme }) => theme.fontFamily.primary};
  color: ${({ theme }) => theme.colors.black};
`;
