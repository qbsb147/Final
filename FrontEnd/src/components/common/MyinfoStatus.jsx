import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import btn from '../../styles/Button';
import useAuthStore from '../../store/authStore';
import { IoMdCheckboxOutline } from 'react-icons/io';
import { CiSquareAlert } from 'react-icons/ci';
import { mentalService } from '../../api/mentals';

const MyinfoStatus = ({ navigate }) => {
  const loginUser = useAuthStore((status) => status.loginUser);
  const [mental, setMental] = useState(null);

  useEffect(() => {
    if (loginUser) {
      const fetchData = async () => {
        const mentalData = await mentalService.getMental(loginUser.user_no);
        setMental(mentalData.data);
      };
      fetchData();
    }
  }, [loginUser]);

  const stress = mental && Array.isArray(mental) ? mental.find((m) => m.separation === 'STRESS') : null;
  const burnout = mental && Array.isArray(mental) ? mental.find((m) => m.separation === 'BURNOUT') : null;

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

  return (
    <InfoBox>
      <InfoStatus>
        <HeadTitle>나의 심리 정보</HeadTitle>
        <Title>나의 스트레스 상태</Title>
        <TextT>
          {loginUser && stress ? (
            <>
              <IoMdCheckboxOutline /> {stress.score}/100
              <CiSquareAlert /> {convertKoreaState(stress.psychological_state)}
            </>
          ) : (
            <TestBtn style={btn.buttonYb} onClick={() => navigate && navigate('/trial/stress')}>
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
            <TestBtn style={btn.buttonYb} onClick={() => navigate && navigate('/trial/burnout')}>
              테스트 하기
            </TestBtn>
          )}
        </TextT>
      </InfoStatus>
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
`;

const InfoStatus = styled.div`
  text-align: left;
  padding-left: ${({ theme }) => theme.spacing.s2};
  font-family: ${({ theme }) => theme.fontFamily.primary};
`;
const HeadTitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  display: flex;
  justify-content: center;
`;

const Title = styled.p`
  margin: ${({ theme }) => theme.spacing.s2} ${({ theme }) => theme.spacing.s1};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;
const TestBtn = styled.button`
  color: ${({ theme }) => theme.colors.black};
  padding: ${({ theme }) => theme.spacing.s2} ${({ theme }) => theme.spacing.s3};
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
export default MyinfoStatus;
