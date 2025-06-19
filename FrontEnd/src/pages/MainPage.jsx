import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ButtonDetail, ButtonYb } from '../styles/Button.styles';
import seoul1 from '../assets/seoul1.jpg';
import siheung1 from '../assets/siheung1.jpg';
import siheung2 from '../assets/siheung2.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

const MainPage = () => {
  const [partners, setPartners] = useState([]);
  const [worcations, setWorcations] = useState([]);
  const [showAISection, setShowAISection] = useState(false);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  const handleShowAI = () => {
    setShowAISection(true);
  };
  useEffect(() => {
    axios
      .get('http://localhost:3001/worcation_partner')
      .then((res) => setPartners(res.data.filter((p) => p.approve === 'Y')))
      .catch(console.error);

    axios
      .get('http://localhost:3001/worcation')
      .then((res) => setWorcations(res.data))
      .catch((err) => console.error(err));

    axios
      .get('http://localhost:3001/review')
      .then((res) => setReviews(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Container>
      <SectionTitle>제휴업체</SectionTitle>
      <PartnerGrid>
        {partners.map((partner) => {
          const matchedWorcation = worcations.find((w) => w.worcation_no === partner.worcation_no);
          if (!matchedWorcation) return null;

          return (
            <PartnerCard key={partner.partner_no}>
              <PartnerImage
                src={matchedWorcation.main_change_photo}
                alt={matchedWorcation.worcation_name}
                onClick={() => navigate(`/worcation/${partner.worcation_no}`)}
              />
              <ImageLabel>
                <ImageLabelT>{matchedWorcation.address.split(' ')[0]}</ImageLabelT>
                {matchedWorcation.worcation_name}
                <br />
                {matchedWorcation.grade || '등급 미지정'}
              </ImageLabel>
            </PartnerCard>
          );
        })}
      </PartnerGrid>

      <SectionTitle>
        인기명소 <span style={{ fontSize: '16px', fontWeight: 'normal' }}>(Top10)</span>
      </SectionTitle>
      <CardList>
        {worcations.map((item) => (
          <PlaceCard key={item.worcation_no}>
            <PlaceImage src={item.main_change_photo} alt={item.worcation_name} />
            <CardContent>
              <InfoBlock>
                <PlaceLocation>{item.address}</PlaceLocation>
                <PlaceName>{item.worcation_thema}</PlaceName>
                <PlaceReview>리뷰 ({reviews.filter((r) => r.application_no === item.worcation_no).length})</PlaceReview>
              </InfoBlock>
              <ThemeBlock>
                <ThemeLabel>테마</ThemeLabel>
                <ThemeText>{item.worcation_thema}</ThemeText>
                <ButtonDetail onClick={() => navigate(`/worcation/${item.worcation_no}`)}>상세보기</ButtonDetail>
              </ThemeBlock>
            </CardContent>
          </PlaceCard>
        ))}
      </CardList>

      <BottomBanner>
        <ButtonYb onClick={handleShowAI}>AI로 여행지 추천 받기</ButtonYb>
      </BottomBanner>

      {showAISection && (
        <>
          <SectionTitle>AI 추천</SectionTitle>
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
        </>
      )}
    </Container>
  );
};

export default MainPage;

const Container = styled.div`
  background-color: #fef6e4;
  min-height: 100vh;
  padding: 5% 5%;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  display: flex;
  justify-content: start;
  font-weight: bold;
  margin-bottom: 2%;
  padding-left: 2%;
`;

const PartnerGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2%;
  margin-bottom: 5%;
  padding-left: 2%;
`;

const PartnerCard = styled.div`
  position: relative;
  width: 30%;
  aspect-ratio: 6 / 5;
`;

const PartnerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  cursor: pointer;
`;

const ImageLabel = styled.div`
  position: absolute;
  bottom: 5%;
  left: 5%;
  color: #fff;
  font-size: 100%;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.75);
  text-align: left;
`;

const ImageLabelT = styled.div`
  font-size: 150%;
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4%;
`;

const PlaceCard = styled.div`
  display: flex;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 20px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 30px;
`;

const PlaceImage = styled.img`
  width: 250px;
  height: 150px;
  object-fit: cover;
  border-radius: 20px;
  margin: 3% 0 3% 3%;
`;

const CardContent = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 5% 5% 3% 5%;
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10%;
  align-items: flex-start;
  justify-content: space-between;
`;

const PlaceLocation = styled.p`
  font-size: 90%;
  color: #555;
`;

const PlaceName = styled.h3`
  font-size: 140%;
  font-weight: bold;
`;

const PlaceReview = styled.p`
  font-size: 90%;
  color: #333;
`;

const ThemeBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: end;
  gap: 5%;
  border-left: 2px solid #ffdd38;
  padding-left: 5%;
`;

const ThemeLabel = styled.p`
  font-size: 90%;
  color: #888;
`;

const ThemeText = styled.p`
  font-size: 110%;
  font-weight: bold;
  color: #000;
`;

const BottomBanner = styled.div`
  margin-top: 3%;
  width: 100%;
  height: 100px;
  background: rgba(235, 235, 235, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;
