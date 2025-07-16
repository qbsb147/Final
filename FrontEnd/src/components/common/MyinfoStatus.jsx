import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import btn from '../../styles/Button';
import useAuthStore from '../../store/authStore';
import { IoMdCheckboxOutline } from 'react-icons/io';
import { CiSquareAlert } from 'react-icons/ci';
import { mentalService } from '../../api/mentals';

const MyinfoStatus = ({ navigate }) => {
  const loginUser = useAuthStore((status) => status.loginUser);
  const [stress, setStresss] = useState('');
  const [burnout, setBurnout] = useState('');

  useEffect(() => {
    if (loginUser) {
      const fetchData = async () => {
        const { stress, burnout } = await mentalService.getMainMental();
        console.log('stress', stress);
        console.log('burnout', burnout);
        setStresss(stress);
        setBurnout(burnout);
      };
      fetchData();
    }
  }, [loginUser]);

  function convertKoreaState(state) {
    switch (state) {
      case 'Normal':
        return '정상';

      case 'Concern':
        return '우려';

      case 'Mild':
        return '경미';

      case 'Severe':
        return '심각';

      case 'Critical':
        return '위급';
    }
  }

  const getRank = (score, updateDate) => {
    if (score === null || score === undefined) return '테스트가 필요합니다.';

    // 날짜가 30일 이상 지났는지 체크
    if (updateDate) {
      const updated = new Date(updateDate);
      const now = new Date();
      const diffDays = (now - updated) / (1000 * 60 * 60 * 24);
      if (diffDays > 30) {
        return '테스트를 다시 진행해주세요.';
      }
    }

    if (score <= 30) return '심리적 위험 신호!\n즉시 충분한 휴식과 전문가 상담이 필요합니다.';
    if (score <= 59) return '스트레스와 번아웃이 모두 매우 높은 상태입니다.\n충분한 휴식이 필요합니다.';
    if (score <= 69) return '환경을 바꾸는 것이 도움이 될 수 있어요.\n워케이션으로 재충전해보세요.';
    if (score <= 79) return '스트레스 또는 번아웃이 중간 이상입니다.\n잠시 멈추고 자신을 돌아보세요.';
    if (score <= 89) return '스트레스와 번아웃이 낮은 건강한 상태입니다!';
    return '스트레스와 번아웃이 매우 낮은 최상의 상태입니다!';
  };

  let rankScore = null;
  if (stress && burnout) {
    rankScore = Math.round((stress.score + burnout.score) / 2);
  } else if (stress) {
    rankScore = stress.score;
  } else if (burnout) {
    rankScore = burnout.score;
  }

  const isOld = (date) => {
    if (!date) return true;
    const updated = new Date(date);
    const now = new Date();
    const diffDays = (now - updated) / (1000 * 60 * 60 * 24);
    return diffDays > 30;
  };

  let expiredList = [];
  if (!stress || isOld(stress.update_date)) expiredList.push('스트레스');
  if (!burnout || isOld(burnout.update_date)) expiredList.push('번아웃');

  let rank;
  if (expiredList.length === 2) {
    rank = `⚠️테스트 기한 만료⚠️\n테스트를 다시 진행해주세요.`;
  } else if (expiredList.length === 1) {
    rank = `⚠️${expiredList[0]} 테스트 기한 만료⚠️\n 테스트를 다시 진행해주세요.`;
  } else {
    rank = getRank(rankScore, (stress && stress.update_date) || (burnout && burnout.update_date));
  }

  return (
    <InfoBox>
      <HeadTitle>나의 심리 정보</HeadTitle>
      <ContentRow>
        <InfoStatus>
          <Title>나의 스트레스 상태</Title>
          <TextT>
            {loginUser && stress ? (
              <>
                <IoMdCheckboxOutline /> {stress.score}/100
                <CiSquareAlert /> {convertKoreaState(stress.psychological_state)}
              </>
            ) : (
              <TestBtn bg="#FFEB8C" onClick={() => navigate && navigate('/trial/stress')}>
                테스트 하기
              </TestBtn>
            )}
          </TextT>
          <Title>나의 번아웃 상태</Title>
          <TextT>
            {loginUser && burnout ? (
              <>
                <IoMdCheckboxOutline /> {burnout.score}/100
                <CiSquareAlert /> {convertKoreaState(burnout.psychological_state)}
              </>
            ) : (
              <TestBtn bg="#FFEB8C" onClick={() => navigate && navigate('/trial/burnout')}>
                테스트 하기
              </TestBtn>
            )}
          </TextT>
        </InfoStatus>
        <RightBox>
          <RightInfoBox>
            {rank.split('\n').map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                <br />
              </React.Fragment>
            ))}

            {/* 버튼 조건부 렌더링 */}
            {expiredList.includes('스트레스') && stress && <TestBtn bg="#fff">스트레스 테스트 다시 하기</TestBtn>}
            {expiredList.includes('번아웃') && burnout && <TestBtn bg="#fff">번아웃 테스트 다시 하기</TestBtn>}
          </RightInfoBox>
        </RightBox>
      </ContentRow>
      {!loginUser && (
        <Overlay>
          <LoginBtn style={btn.buttonYb} onClick={() => navigate && navigate('/login')}>
            로그인 후 이용해주세요
          </LoginBtn>
        </Overlay>
      )}
    </InfoBox>
  );
};

const InfoBox = styled.div`
  width: 60%;
  min-height: 200px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  margin: ${({ theme }) => theme.spacing.s0};
  padding: ${({ theme }) => theme.spacing.s2};
  background-color: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 0;
`;

const HeadTitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  z-index: 2;
`;

const ContentRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const InfoStatus = styled.div`
  text-align: left;
  padding-left: ${({ theme }) => theme.spacing.s2};
  font-family: ${({ theme }) => theme.fontFamily.primary};
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
`;

const Title = styled.p`
  margin: ${({ theme }) => theme.spacing.s1} ${({ theme }) => theme.spacing.s1};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  width: 100%;
`;

const TestBtn = styled.button`
  color: ${({ theme }) => theme.colors.black};
  padding: ${({ theme }) => theme.spacing.s1};
  border: 1px solid black;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
  background: ${({ bg }) => bg || 'white'};
  font-size: 1rem;
  width: 90%;
`;

const TextT = styled.p`
  font-family: ${({ theme }) => theme.fontFamily.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const LoginBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 20%;
`;

const RightBox = styled.div`
  flex: 1;
  min-width: 200px;
  min-height: 120px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const RightInfoBox = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: black;
  padding: 4px;
  flex-direction: column;
`;

export default MyinfoStatus;
