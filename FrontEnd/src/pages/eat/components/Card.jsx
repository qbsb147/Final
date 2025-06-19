import React from 'react';
import styled from 'styled-components';
import { Subtitle, SmallText, Text } from '../../../styles/Typography';

const Card = ({ eat }) => {
  return (
    <Box>
      <Content>
        <Subtitle>{eat.title}</Subtitle>
        <Row>
          <Circle />
          <Text>메뉴 구성</Text>
        </Row>
        <MenuText>{eat.menu}</MenuText>
        <Row>
          <InfoCircle />
          <Text>식단 설명</Text>
        </Row>
        <MenuText>{eat.explain}</MenuText>
      </Content>
      <Image src={eat.image} alt="식사 이미지" />
    </Box>
  );
};

export default Card;
const MenuText = styled(SmallText)`
  width: 70%;
  text-align: left;
  margin-left: 30px;
`;

const Row = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
`;
const Box = styled.div`
  background: ${({ theme }) => theme.colors.white};
  width: 900px;
  height: 222px;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  position: relative;
`;

const Content = styled.div`
  width: 678px;
  height: 222px;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 20px;
`;

const Image = styled.img`
  width: 222px;
  height: 222px;
  border-radius: 0 ${({ theme }) => theme.borderRadius['2xl']} ${({ theme }) => theme.borderRadius['2xl']} -;
  position: absolute;
  right: 0px;
  top: 0px;
`;

const Circle = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.secondary};
`;

const InfoCircle = styled(Circle)`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.success};
`;
