import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import WorcationCalendar from '../../components/common/WocationCalendar';
import Button from '../../styles/Button';
import Input from '../../styles/Input';
import { useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import memberService from '../../api/members';
import { applicationService } from '../../api/application';
import { useNavigate } from 'react-router-dom';

const WorcationApply = () => {
  const location = useLocation();
  const passedWorcation = location.state?.worcation;
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [worcationInfo, setWorcationInfo] = useState(null);
  const [events, setEvents] = useState([]);
  const { loginUser } = useAuthStore();
  const [userInfo, setUserInfo] = useState(null);
  const [fullDates, setFullDates] = useState({});

  useEffect(() => {
    const fetchFullDates = async () => {
      if (!passedWorcation) return;

      const today = new Date().toISOString().split('T')[0];
      const end = new Date();
      end.setMonth(end.getMonth() + 3); // 3개월 후까지 조회
      const endStr = end.toISOString().split('T')[0];

      try {
        const result = await applicationService.getFullDates(passedWorcation.worcation_no, today, endStr);
        setFullDates(result);
      } catch (e) {
        console.error('꽉 찬 날짜 조회 실패', e);
      }
    };

    fetchFullDates();
  }, [passedWorcation]);

  useEffect(() => {
    if (!loginUser?.user_id) return;

    const fetchUserInfo = async () => {
      const res = await memberService.getMyPage(); // user_no 포함 정보
      setUserInfo(res);
    };

    fetchUserInfo();
  }, [loginUser?.user_id]);

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
        const data = await applicationService.reserved_worcation(passedWorcation.worcation_no);
        const reservations = data.map((app) => ({
          title: '예약됨',
          start: new Date(app.startDate),
          end: new Date(app.endDate),
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

    if (new Date(startDate) > new Date(endDate)) {
      alert('시작일은 종료일보다 먼저여야 합니다.');
      return;
    }

    const isFullInRange = () => {
      const s = new Date(startDate);
      const e = new Date(endDate);
      while (s <= e) {
        const dateStr = s.toISOString().slice(0, 10);
        if (fullDates[dateStr]) return true;
        s.setDate(s.getDate() + 1);
      }
      return false;
    };

    if (isFullInRange()) {
      alert('선택한 날짜 범위 중 예약 마감된 날짜가 포함되어 있습니다.');
      return;
    }

    const newApplication = {
      user_no: userInfo.user_no, // getMyPage()에서 가져온 user_no 사용
      worcation_no: worcationInfo.worcation_no, // 미리 저장해둔 워케이션 번호
      startDate: startDate,
      endDate: endDate,
    };

    try {
      await applicationService.create(newApplication);
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
          <WorcationCalendar
            events={events}
            fullDates={fullDates} // 마감 날짜 정보
            onSelectSlot={({ start }) => setStartDate(start.toISOString().slice(0, 10))}
          />{' '}
          <InfoBox>
            <Label>워케이션 신청자</Label>
            <ReadOnlyInput value={loginUser?.name ?? ''} readOnly />

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
