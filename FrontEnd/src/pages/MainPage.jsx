import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ButtonDetail, ButtonYb } from '../styles/Button.styles';
import { useNavigate } from 'react-router-dom';
import { worcationService } from '../api/worcations';
import WorcationCardList from '../components/worcation/WorcationCardList';
import useWorcationStore from '../store/worcationStore';
import useAuthStore from '../store/authStore';

const MainPage = () => {
  const [worcations, setWorcations] = useState([]);
  const [showAISection, setShowAISection] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [applications, setApplications] = useState([]);
  const keyword = useWorcationStore((state) => state.keyword);
  const navigate = useNavigate();
  const setPopularKeywords = useWorcationStore((state) => state.setPopularKeywords);
  const loginUser = useAuthStore((state) => state.loginUser);

  const handleShowAI = () => {
    setShowBanner(false);
    setShowAISection(true);
    //Ai 출력 로직
  };
  useEffect(() => {
    const fetchData = async () => {
      const data = await worcationService.list();
      const appData = await worcationService.applicationList();
      setWorcations(data);
      setApplications(appData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setPopularKeywords(worcations.slice(0, 5).map((w) => w.worcation_name));
  }, [worcations, setPopularKeywords]);

  // 필터링된 워케이션
  const filteredWorcations = worcations.filter(
    (w) => (w.worcation_name && w.worcation_name.includes(keyword)) || (w.address && w.address.includes(keyword))
  );
  const sortedWorcations = filteredWorcations
    .map((w) => {
      // approve가 'Y'인 신청만 카운트
      const approvedCount = applications.filter(
        (app) => app.worcation_no === w.worcation_no && app.approve === 'Y'
      ).length;
      return {
        ...w,
        approvedApplicationCount: approvedCount,
      };
    })
    // 신청이 1개 이상인 워케이션만
    .filter((w) => w.approvedApplicationCount > 0)
    // 내림차순 정렬
    .sort((a, b) => b.approvedApplicationCount - a.approvedApplicationCount);

  return (
    <Container>
      {loginUser?.company_no && (
  <>
    <SectionTitle>제휴업체</SectionTitle>
    <PartnerGrid>
      {filteredWorcations
        .filter((w) => w.partners && w.partners.some((p) => p.approve === 'Y'))
        .map((matchedWorcation) => (
          <PartnerCard key={matchedWorcation.worcation_no}>
            <PartnerImage
              src={matchedWorcation.main_change_photo}
              alt={matchedWorcation.worcation_name}
              onClick={() => navigate(`/worcation/${matchedWorcation.worcation_no}`)}
            />
            <ImageLabel>
              <ImageLabelT>
                {matchedWorcation.worcation_address
                  ? matchedWorcation.worcation_address.split(' ')[0]
                  : '주소없음'}
              </ImageLabelT>
              {matchedWorcation.worcation_name}
            </ImageLabel>
          </PartnerCard>
        ))}
    </PartnerGrid>
  </>
)}

      <SectionTitle>
        인기명소 <span style={{ fontSize: '16px', fontWeight: 'normal' }}>(Top10)</span>
      </SectionTitle>
      <WorcationCardList data={sortedWorcations.slice(0, 10)} navigate={navigate} />

      {showBanner && (
        <BottomBanner>
          <ButtonYb onClick={handleShowAI}>AI로 여행지 추천 받기</ButtonYb>
        </BottomBanner>
      )}
      {showAISection && (
        <>
          <SectionTitle>AI 추천</SectionTitle>
          <CardList>
            <WorcationCardList data={filteredWorcations} navigate={navigate} />
            {/* AI 필터 추가 해야함 */}
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
