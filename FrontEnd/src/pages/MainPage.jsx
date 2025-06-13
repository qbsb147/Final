import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../styles/Button';
import busan1 from '../assets/busan1.jpg';
import busan2 from '../assets/busan2.jpg';
import seoul1 from '../assets/seoul1.jpg';
import seoul2 from '../assets/seoul2.jpg';
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

const PopularPlacesPage = () => {
  const [showAISection, setShowAISection] = useState(false);

  const handleShowAI = () => {
    setShowAISection(true);
  };

  return (
    <Container>
      <SectionTitle>제휴업체</SectionTitle>
      <PartnerGrid>
        <PartnerCard>
          <PartnerImage src={busan1} alt="인천 서해앞바다 호텔" />
          <ImageLabel>
            <ImageLabelT>인천</ImageLabelT>
            서해앞바다
            <br />
            3성급 호텔
          </ImageLabel>
        </PartnerCard>
        <PartnerCard>
          <PartnerImage src={busan2} alt="부산 광안해수욕장 호텔" />
          <ImageLabel>
            <ImageLabelT>부산</ImageLabelT>
            광안해수욕장
            <br />
            3성급 호텔
          </ImageLabel>
        </PartnerCard>
        <PartnerCard>
          <PartnerImage src={seoul2} alt="서울 동대문 호텔" />
          <ImageLabel>
            <ImageLabelT>서울</ImageLabelT>
            동대문프라자
            <br />
            5성급 호텔
          </ImageLabel>
        </PartnerCard>
      </PartnerGrid>

      <SectionTitle>
        인기명소 <span style={{ fontSize: '16px', fontWeight: 'normal' }}>(Top10)</span>
      </SectionTitle>
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
                <ButtonD style={Button.buttonDetail}>상세보기</ButtonD>
              </ThemeBlock>
            </CardContent>
          </PlaceCard>
        ))}
      </CardList>

      <BottomBanner>
        <BottomButton onClick={handleShowAI}>AI로 여행지 추천 받기</BottomButton>
      </BottomBanner>

      {showAISection && (
        <>
          <SectionTitleAI>AI 추천</SectionTitleAI>
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
                    <ButtonD style={Button.buttonDetail}>상세보기</ButtonD>
                  </ThemeBlock>
                </CardContent>
              </PlaceCard>
            ))}
          </CardList>
        </>
      )}
    </Container>
  );
};

export default PopularPlacesPage;

const Container = styled.div`
  background-color: #fef6e4;
  min-height: 100vh;
  padding: 60px 24px;
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 24px;
  display: flex;
  padding-left: 30px;
`;

const SectionTitleAI = styled.h2`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 24px;
  margin-top: 30px;
  display: flex;
  padding-left: 30px;
`;

const PartnerGrid = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 60px;
  flex-wrap: wrap;
  padding-left: 30px;
`;

const PartnerCard = styled.div`
  position: relative;
  width: 366px;
  height: 305px;
`;

const PartnerImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 16px;
  display: flex;
  justify-content: space-around;
`;

const ImageLabel = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.75);
  text-align: left;
`;

const ImageLabelT = styled.div`
  font-size: 26px;
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const PlaceCard = styled.div`
  display: flex;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 20px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const PlaceImage = styled.img`
  width: 420px;
  height: 280px;
  object-fit: cover;
  border-radius: 20px 0 0 20px;
  margin: 40px 0 40px 40px;
`;

const CardContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 40px;
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const PlaceLocation = styled.p`
  font-size: 16px;
  color: #555;
  text-align: left;
`;

const PlaceName = styled.h3`
  font-size: 24px;
  font-weight: bold;
  text-align: left;
`;

const PlaceReview = styled.p`
  font-size: 16px;
  color: #333;
  text-align: left;
`;

const ThemeBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: end;
  gap: 8px;
  border-left: 2px solid #ffdd38;
  padding-left: 24px;
  height: 100%;
`;

const ThemeLabel = styled.p`
  font-size: 16px;
  color: #888;
`;

const ThemeText = styled.p`
  font-size: 20px;
  font-weight: bold;
  color: #000;
`;

const ButtonD = styled.button`
  width: 150px;
  height: 50px;
  color: #ffffff;
`;

const BottomBanner = styled.div`
  margin-top: 30px;
  position: relative;
  width: 100%;
  height: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(235, 235, 235, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BottomButton = styled.button`
  background: #ffeb8c;
  border-radius: 10px;
  padding: 10px 20px;
  font-family: 'Godo B';
  font-size: 24px;
  font-weight: bold;
  color: #333333;
  border: none;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
`;
