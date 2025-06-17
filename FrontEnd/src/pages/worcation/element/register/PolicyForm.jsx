import React, { useState } from 'react';
import styled from 'styled-components';
import CustomTextArea from '../../../../components/common/TextArea';

const Form = () => {
  const [checkinPeriod, setCheckinPeriod] = useState('AM');
  const [checkinHour, setCheckinHour] = useState('9');
  const [checkinMinute, setCheckinMinute] = useState('00');
  const [checkoutPeriod, setCheckoutPeriod] = useState('AM');
  const [checkoutHour, setCheckoutHour] = useState('11');
  const [checkoutMinute, setCheckoutMinute] = useState('00');

  const [officeStartPeriod, setOfficeStartPeriod] = useState('AM');
  const [officeStartHour, setOfficeStartHour] = useState('9');
  const [officeStartMinute, setOfficeStartMinute] = useState('00');
  const [officeEndPeriod, setOfficeEndPeriod] = useState('PM');
  const [officeEndHour, setOfficeEndHour] = useState('6');
  const [officeEndMinute, setOfficeEndMinute] = useState('00');

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
                  value={checkinHour}
                  onChange={(e) => setCheckinHour(e.target.value)}
                />
                <TimeSeparator>:</TimeSeparator>
                <MinuteInput
                  type="number"
                  min="0"
                  max="59"
                  value={checkinMinute}
                  onChange={(e) => setCheckinMinute(e.target.value)}
                />
                <Select value={checkinPeriod} onChange={(e) => setCheckinPeriod(e.target.value)}>
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
                  value={officeStartHour}
                  onChange={(e) => setOfficeStartHour(e.target.value)}
                />
                <TimeSeparator>:</TimeSeparator>
                <MinuteInput
                  type="number"
                  min="0"
                  max="59"
                  value={officeStartMinute}
                  onChange={(e) => setOfficeStartMinute(e.target.value)}
                />
                <Select value={officeStartPeriod} onChange={(e) => setOfficeStartPeriod(e.target.value)}>
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
                  value={checkoutHour}
                  onChange={(e) => setCheckoutHour(e.target.value)}
                />
                <TimeSeparator>:</TimeSeparator>
                <MinuteInput
                  type="number"
                  min="0"
                  max="59"
                  value={checkoutMinute}
                  onChange={(e) => setCheckoutMinute(e.target.value)}
                />
                <Select value={checkoutPeriod} onChange={(e) => setCheckoutPeriod(e.target.value)}>
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
                  value={officeEndHour}
                  onChange={(e) => setOfficeEndHour(e.target.value)}
                />
                <TimeSeparator>:</TimeSeparator>
                <MinuteInput
                  type="number"
                  min="0"
                  max="59"
                  value={officeEndMinute}
                  onChange={(e) => setOfficeEndMinute(e.target.value)}
                />
                <Select value={officeEndPeriod} onChange={(e) => setOfficeEndPeriod(e.target.value)}>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </Select>
              </TimeInputWrap>
            </TD>
            <TD $fromto>까지</TD>
          </TR>
          <TR>
            <TH>길 안내</TH>
            <TD colSpan={3} style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <CustomTextArea rows={7}></CustomTextArea>
            </TD>
          </TR>
        </TBody>
      </Table>
    </Body>
  );
};

export default Form;

const Body = styled.div`
  gap: ${({ theme }) => theme.spacing.s8};
  padding: ${({ theme }) => theme.spacing.s10};
  height: 562px;
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.gray[200]};
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
