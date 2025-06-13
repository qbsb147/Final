import React from 'react'
import styled from 'styled-components'
import btn from '../../../styles/Button'

const MyinfoStatus = () => {
    // userContext 저장 후 실행
    // const { user } = useUser();
    // const { stress, burnout } =user;

  return (
    <InfoBox>
        <HeadTitle>나의 심리 정보</HeadTitle>
      <InfoStatus>
        <Title>나의 스트레스 상태</Title>
        <TextT>[아이콘] 20/40 점 [아이콘]중증</TextT>
        
        {/* {stress ? (
            <p>[아이콘] 20/40 점 [아이콘]중증</p>
        ) : (
            <p>정보 x</p>
        )} */}

        <Title>나의 번아웃 상태</Title>
        <TestBtn style = {btn.buttonYb}>테스트 하기</TestBtn>
        
        {/* {burnout ? (
            <p>[아이콘] 20/40 점 [아이콘]점수?</p>
        ) : (
            <TestBtn style = {btn.buttonYb}>테스트 하기</TestBtn>
        )} */}

      </InfoStatus>
    </InfoBox>
  )
}
const InfoBox = styled.div`
    width : 40%;
    border: 1px solid ${({ theme }) => theme.colors.primary};;
    margin-left: ${({ theme }) => theme.spacing.s12};
    padding : ${({ theme }) => theme.spacing.s2};
    background-color: ${({ theme }) => theme.colors.white};
`;

const InfoStatus = styled.div`
    text-align : left;
    padding-left: ${({ theme }) => theme.spacing.s2};
    font-family : ${({ theme }) => theme.fontFamily.primary};
`;
const HeadTitle = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.base};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const Title = styled.p`
    margin : ${({ theme }) => theme.spacing.s2} ${({ theme }) => theme.spacing.s1};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
`;
const TestBtn = styled.button`
    color : ${({ theme }) => theme.colors.black};
    padding : ${({ theme }) => theme.spacing.s2} ${({ theme }) => theme.spacing.s3};
`;

const TextT = styled.p`
    font-family : ${({ theme }) => theme.fontFamily.secondary};
    font-size: ${({ theme }) => theme.fontSizes.sm};
`;
export default MyinfoStatus
