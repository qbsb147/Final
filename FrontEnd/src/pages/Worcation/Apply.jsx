import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import WorcationCalendar from '../../components/common/WocationCalendar';
import Button from '../../styles/Button';
import Input from '../../styles/Input';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import memberService from '../../api/members';
import { applicationService } from '../../api/application';

const WorcationApply = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const passedWorcation = location.state?.worcation;

  const [start_date, setStartDate] = useState('');
  const [end_date, setEndDate] = useState('');
  const [worcationInfo, setWorcationInfo] = useState(null);
  const [events, setEvents] = useState([]);
  const [fullDates, setFullDates] = useState({});
  const [userInfo, setUserInfo] = useState(null);
  const { loginUser } = useAuthStore();

  // 마감된 날짜 조회
  useEffect(() => {
    const fetchFullDates = async () => {
      const worcationNo = passedWorcation?.worcationNo;
      if (!worcationNo) return;

      const today = new Date().toISOString().split('T')[0];
      const future = new Date();
      future.setMonth(future.getMonth() + 3);
      const endStr = future.toISOString().split('T')[0];

      try {
        const result = await applicationService.getFullDates(worcationNo, today, endStr);
        setFullDates(result);
      } catch (err) {
        console.error('꽉 찬 날짜 조회 실패', err);
      }
    };
    fetchFullDates();
  }, [passedWorcation]);

  // 유저 정보 불러오기
  useEffect(() => {
    if (!loginUser?.user_no) return;
    const fetchUserInfo = async () => {
      try {
        const res = await memberService.getMyInfo(loginUser.user_no);
        setUserInfo(res);
      } catch (err) {
        console.error('유저 정보 조회 실패', err);
      }
    };
    fetchUserInfo();
  }, [loginUser?.user_no]);

  // 워케이션 기본 정보 세팅
  useEffect(() => {
    if (passedWorcation) {
      setWorcationInfo({
        name: passedWorcation.worcation_name,
        price: passedWorcation.non_partner_price,
        worcation_no: passedWorcation.worcation_no,
      });
    }
  }, [passedWorcation]);

  // 예약된 기간 조회 → 달력에 표시
  useEffect(() => {
    const fetchReservations = async () => {
      if (!passedWorcation) return;
      try {
        const data = await applicationService.reserved_worcation(passedWorcation.worcation_no);
        const mapped = data.map((app) => ({
          title: '예약됨',
          start: new Date(app.startDate),
          end: new Date(app.endDate),
        }));
        setEvents(mapped);
      } catch (err) {
        console.error('예약 정보 불러오기 실패:', err);
      }
    };
    fetchReservations();
  }, [passedWorcation]);

  const handleSubmit = async () => {
    if (!start_date || !end_date || !worcationInfo || !userInfo) {
      alert('모든 정보를 입력해주세요.');
      return;
    }

    if (new Date(start_date) > new Date(end_date)) {
      alert('시작일은 종료일보다 앞서야 합니다.');
      return;
    }

    const isFull = () => {
      const s = new Date(start_date);
      const e = new Date(end_date);
      while (s <= e) {
        const d = s.toISOString().split('T')[0];
        if (fullDates[d]) return true;
        s.setDate(s.getDate() + 1);
      }
      return false;
    };

    if (isFull()) {
      alert('선택한 날짜 중 예약 마감된 날짜가 포함되어 있습니다.');
      return;
    }

    try {
      const application = {
        user_no: userInfo.user_no,
        worcation_no: worcationInfo.worcation_no,
        start_date,
        end_date,
      };
      await applicationService.create(application);
      alert('워케이션 신청이 완료되었습니다!');
      navigate('/my/worcation-history');
    } catch (err) {
      console.error('신청 실패:', err);
      alert('신청 중 오류가 발생했습니다.');
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
          <WorcationCalendar events={events} fullDates={fullDates} selectable={false} onSelectSlot={() => {}} />
          {/* fullDates로 꽉찬 날짜 표시 */}
          <InfoBox>
            <Label>워케이션 신청자</Label>
            <ReadOnlyInput value={loginUser?.user_name ?? ''} readOnly />
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
                value={start_date}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </DateBlock>
            <Tilde>~</Tilde>
            <DateBlock>
              <Label>종료 일</Label>
              <DateInput
                type="date"
                style={Input.InputOrange}
                value={end_date}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </DateBlock>
          </DateRangeWrapper>
        </DateSection>

        <ButtonSection>
          <CancelButton style={Button.buttonYb} onClick={() => navigate(-1)}>
            취소
          </CancelButton>
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
  height: 50%;
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
  text-align: left;
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
  &::-webkit-calendar-picker-indicator {
    filter: brightness(0);
  }
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
