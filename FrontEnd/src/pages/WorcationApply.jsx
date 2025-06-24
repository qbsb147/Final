import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import WorcationCalendar from '../components/common/Calendar';
import Button from '../styles/Button';
import Input from '../styles/Input';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const WorcationApply = () => {
  const location = useLocation();
  const passedWorcation = location.state?.worcation;

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [worcationInfo, setWorcationInfo] = useState(null);
  const [events, setEvents] = useState([]);
  const { user } = useAuthStore();

  useEffect(() => {
    if (passedWorcation) {
      setWorcationInfo({
        name: passedWorcation.worcation_name,
        price: passedWorcation.non_partner_price,
        no: passedWorcation.worcation_no,
      });
    }
  }, [passedWorcation]);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!passedWorcation) return;

      try {
        const response = await axios.get(
          `http://localhost:3001/worcation_application?ref_worcation_no=${passedWorcation.worcation_no}`
        );
        const reservations = response.data.map((app) => ({
          title: '예약됨',
          start: new Date(app.start_date),
          end: new Date(app.end_date),
        }));
        setEvents(reservations);
      } catch (error) {
        console.error('예약 정보 불러오기 실패:', error);
      }
    };

    fetchReservations();
  }, [passedWorcation]);

  const handleSubmit = async () => {
    if (!worcationInfo) {
      alert('워케이션 정보를 불러오는 중입니다.');
      return;
    }

    if (!startDate || !endDate) {
      alert('시작일과 종료일을 모두 선택해주세요.');
      return;
    }

    const newApplication = {
      application_no: Date.now(), // 임시 ID
      ref_member_no: 1, // 예시로 고정값
      ref_worcation_no: worcationInfo.no,
      start_date: startDate,
      end_date: endDate,
      approve: 'N',
      create_at: new Date().toISOString(),
      update_at: new Date().toISOString(),
    };

    try {
      await axios.post('http://localhost:3001/worcation_application', newApplication);
      alert('워케이션 신청 완료!');
    } catch (error) {
      console.error('신청 실패:', error);
      alert('신청 중 오류 발생');
    }
  };

  return (
    <Container>
      <Card>
        <Header>
          <Title>워케이션 신청</Title>
          <Subtitle>{worcationInfo?.name}</Subtitle>
        </Header>

        <CalendarSection>
          <WorcationCalendar events={events} />

          <InfoBox>
            <Label>워케이션 신청자</Label>
            <ReadOnlyInput value={user?.name ?? ''} readOnly />

            <Label>금액</Label>
            <ReadOnlyInput value={worcationInfo?.price?.toLocaleString() ?? ''} readOnly />
          </InfoBox>
        </CalendarSection>

        <DateSection>
          <DateRangeWrapper>
            <DateBlock>
              <Label>시작 일</Label>
              <DateInput
                type="date"
                style={Input.InputOrange}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </DateBlock>
            <Tilde>~</Tilde>
            <DateBlock>
              <Label>종료 일</Label>
              <DateInput
                type="date"
                style={Input.InputOrange}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </DateBlock>
          </DateRangeWrapper>
        </DateSection>

        <ButtonSection>
          <CancelButton style={Button.buttonYb}>취소</CancelButton>
          <SubmitButton style={Button.buttonWhite} onClick={handleSubmit}>
            신청
          </SubmitButton>
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
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
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
  align-items: center;
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
  margin-top: 30px;
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
