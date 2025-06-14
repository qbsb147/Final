import React from 'react';
import styled from 'styled-components';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import ko from 'date-fns/locale/ko';
import Button from '../styles/Button';
import Input from '../styles/Input';

const locales = { ko };

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
      <Card>
        <Header>
          <Title>워케이션 신청</Title>
          <Subtitle>간세</Subtitle>
        </Header>

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
          <DateRangeWrapper>
            <DateBlock>
              <Label>시작 일</Label>
              <DateInput type="date" style={Input.InputOrange} />
            </DateBlock>
            <Tilde>~</Tilde>
            <DateBlock>
              <Label>종료 일</Label>
              <DateInput type="date" style={Input.InputOrange} />
            </DateBlock>
          </DateRangeWrapper>
        </DateSection>

        <ButtonSection>
          <CancelButton style={Button.buttonYb}>취소</CancelButton>
          <SubmitButton style={Button.buttonWhite}>신청</SubmitButton>
        </ButtonSection>
      </Card>
    </Container>
  );
};

export default WorcationApply;

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.colors.white};
`;

const Card = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.gray[100]};
  padding: ${({ theme }) => theme.spacing.s12};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.s8};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  color: ${({ theme }) => theme.colors.black};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  ${({ theme }) => theme.spacing.s3}
  display: flex;
  margin-left: ${({ theme }) => theme.spacing.s12};
`;

const Subtitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.s5};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const CalendarSection = styled.div`
  display: flex;
  justify-content: space-around;
  gap: ${({ theme }) => theme.spacing.s10};
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.s4};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.black};
`;

const ReadOnlyInput = styled.input`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.s3};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const DateSection = styled.div`
  display: flex;
  width: 95%;
  height: 12%;
  margin-left: ${({ theme }) => theme.spacing.s16};
  flex-direction: column;
  align-items: flex-start;
  margin-top: ${({ theme }) => theme.spacing.s10};
`;

const DateRangeWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: ${({ theme }) => theme.spacing.s4};
  margin-top: ${({ theme }) => theme.spacing.s2};
`;

const DateBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5%;
  width: 45%;
`;

const DateInput = styled.input`
  width: 100%;
  height: 90%;
  font-size: ${({ theme }) => theme.fontSizes.base};
  padding: 2%;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const Tilde = styled.span`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.black};
`;

const ButtonSection = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.s10};
  margin-top: ${({ theme }) => theme.spacing.s12};
`;

const CancelButton = styled.button`
  width: 23%;
  height: 100%;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const SubmitButton = styled.button`
  width: 23%;
  height: 100%;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;
