import React from 'react';
import styled from 'styled-components';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import ko from 'date-fns/locale/ko';
import Button from '../styles/Button';
const locales = {
  ko: ko,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

const DnDCalendar = withDragAndDrop(Calendar);

const WorcationApply = () => {
  const events = [
    {
      title: '예약된 일정',
      start: new Date(),
      end: new Date(),
    },
  ];

  return (
    <Container>
      <Title>워케이션 신청</Title>
      <Subtitle>간세</Subtitle>

      <CalendarSection>
        <DnDCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          draggableAccessor={() => true}
          style={{ width: '789px', height: '442px', borderRadius: '10px' }}
        />

        <InfoBox>
          <Label>워케이션 신청자</Label>
          <ReadOnlyInput value="최예찬" readOnly />

          <Label>금액</Label>
          <ReadOnlyInput value="45500" readOnly />
        </InfoBox>
      </CalendarSection>

      <DateSection>
        <DateInputBox>
          <Label>시작 일</Label>
          <DateInput type="date" />
        </DateInputBox>

        <Dash>-</Dash>

        <DateInputBox>
          <Label>종료 일</Label>
          <DateInput type="date" />
        </DateInputBox>
      </DateSection>

      <ButtonSection>
        <CancelButton style={Button.buttonYb}>취소</CancelButton>
        <SubmitButton style={Button.buttonWhite}>신청</SubmitButton>
      </ButtonSection>
    </Container>
  );
};

export default WorcationApply;

const Container = styled.div`
  width: 100%;
  height: auto;
  margin: 0 auto;
  padding-top: 50px;
  background: ${({ theme }) => theme.colors.gray[100]};
  padding-bottom: 100px;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: 10px;
  display: flex;
  margin-left: 50px;
`;

const Subtitle = styled.h2`
  font-size: 35px;
  color: #010101;
  margin-bottom: 20px;
`;

const CalendarSection = styled.div`
  display: flex;
  justify-content: space-around;
  margin-left: 30px;
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Label = styled.label`
  font-size: 25px;
  font-weight: bold;
`;

const ReadOnlyInput = styled.input`
  background: #fffae6;
  border: 0.7px solid #c3c3c3;
  border-radius: 10px;
  padding: 10px;
  font-size: 25px;
  color: #333;
`;

const DateSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  gap: 20px;
`;

const DateInputBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const DateInput = styled.input`
  width: 455px;
  height: 48px;
  border: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  font-size: 24px;
  padding: 10px;
`;

const Dash = styled.span`
  font-size: 30px;
  color: #000;
`;

const ButtonSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 80px;
  margin-top: 50px;
`;

const CancelButton = styled.button`
  width: 200px;
  height: 50px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
`;

const SubmitButton = styled.button`
  width: 200px;
  height: 50px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
`;
