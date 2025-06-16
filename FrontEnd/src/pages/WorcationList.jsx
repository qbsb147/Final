import React, { useState } from 'react';
import styled from 'styled-components';
import { ButtonBorder, ButtonDetail } from '../styles/Button.styles';
import seoul1 from '../assets/seoul1.jpg';
import siheung1 from '../assets/siheung1.jpg';
import siheung2 from '../assets/siheung2.jpg';

const data = [
  {
    id: 1,
    location: '서울특별시 영등포구',
    name: '포포인츠 알파이 워케이션',
    reviewCount: 15,
    theme: '모던스타일 / 도심',
    image: seoul1,
  },
  {
    id: 2,
    location: '경기도 시흥시',
    name: '이노테이션 워케이션',
    reviewCount: 16,
    theme: '모던 / 자연 퓨전',
    image: siheung1,
  },
  {
    id: 3,
    location: '경기도 시흥시',
    name: '이노테이션 워케이션',
    reviewCount: 16,
    theme: '모던 / 자연 퓨전',
    image: siheung2,
  },
];

const WorcationList = () => {
  const [showAISection, setShowAISection] = useState(false);

  const handleShowAI = () => {
    setShowAISection(true);
  };

  return (
    <Container>
      <ButtonWrapper>
        <ButtonBorder>제휴 업체 보기</ButtonBorder>
        <ButtonBorder onClick={handleShowAI}>ai 추천</ButtonBorder>
      </ButtonWrapper>

      <SectionTitle>전체 리스트 보기</SectionTitle>
      <CardList>
        {data.map((item) => (
          <PlaceCard key={item.id}>
            <PlaceImage src={item.image} alt={item.name} />
            <CardContent>
              <InfoBlock>
                <PlaceLocation>{item.location}</PlaceLocation>
                <PlaceName>{item.name}</PlaceName>
                <PlaceReview>리뷰 ({item.reviewCount})</PlaceReview>
              </InfoBlock>
              <ThemeBlock>
                <ThemeLabel>테마</ThemeLabel>
                <ThemeText>{item.theme}</ThemeText>
                <ButtonDetail>상세보기</ButtonDetail>
              </ThemeBlock>
            </CardContent>
          </PlaceCard>
        ))}
      </CardList>

      {showAISection && (
        <>
          <Container2>
            <SectionTitleAI>AI 추천 비제휴 업체</SectionTitleAI>
            <CardList>
              {data.map((item) => (
                <PlaceCard key={item.id}>
                  <PlaceImage src={item.image} alt={item.name} />
                  <CardContent>
                    <InfoBlock>
                      <PlaceLocation>{item.location}</PlaceLocation>
                      <PlaceName>{item.name}</PlaceName>
                      <PlaceReview>리뷰 ({item.reviewCount})</PlaceReview>
                    </InfoBlock>
                    <ThemeBlock>
                      <ThemeLabel>테마</ThemeLabel>
                      <ThemeText>{item.theme}</ThemeText>
                      <ButtonDetail>상세보기</ButtonDetail>
                    </ThemeBlock>
                  </CardContent>
                </PlaceCard>
              ))}
            </CardList>
          </Container2>
        </>
      )}
    </Container>
  );
};
export default WorcationList;

const Container = styled.div`
  border-top: 2px solid ${({ theme }) => theme.colors.brown};
  border-bottom: 2px solid ${({ theme }) => theme.colors.brown};
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  padding: 3% 5%;
  text-align: left;
`;
const Container2 = styled.div`
  margin-top: 50px;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 2%;
  margin-bottom: 2%;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: bold;
  margin: 30px;
`;
const SectionTitleAI = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: bold;
  margin-bottom: 24px;
  margin-top: 30px;
  display: flex;
  padding-left: 30px;
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const PlaceCard = styled.div`
  display: flex;
  background: #fff;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const PlaceImage = styled.img`
  width: 25%;
  height: 20%;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  margin: 20px 0 20px 40px;
`;

const CardContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 65%;
  padding: 3%;
  gap: 30%;
  flex-wrap: wrap;
`;

const InfoBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 12px;
`;

const PlaceLocation = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const PlaceName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: bold;
`;

const PlaceReview = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[800]};
`;

const ThemeBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  border-left: 2px solid ${({ theme }) => theme.colors.yellow};
  padding-left: 5%;
`;

const ThemeLabel = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const ThemeText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.black};
`;
