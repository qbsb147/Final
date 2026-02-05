import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { worcationService } from '../api/worcations';
import WorcationCardList from './worcation/components/WorcationCardList';
import useSearchStore from '../store/useSearchStore';
import useAuthStore from '../store/authStore';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const MainPage = () => {
  const [worcations, setWorcations] = useState([]);
  const [applications, setApplications] = useState([]);
  const keyword = useSearchStore((state) => state.keyword);
  const navigate = useNavigate();
  const setPopularKeywords = useSearchStore((state) => state.setPopularKeywords);
  const loginUser = useAuthStore((state) => state.loginUser);
  const [aiWorcations, setAiWorcations] = useState([]);
  const [aiLoading, setAiLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await worcationService.list();
        const appData = await worcationService.applicationList();
        // API may return either an array or a paged object { content: [...] }
        const worcationList = Array.isArray(data) ? data : data?.content || [];
        const applicationsList = Array.isArray(appData) ? appData : appData?.content || [];
        setWorcations(worcationList);
        setApplications(applicationsList);
      } catch (error) {
        console.error('데이터를 불러오는 중 오류가 발생했습니다.', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchAi = async () => {
      if (!loginUser) return;
      setAiLoading(true);
      try {
        const res = await worcationService.getAIList(0, 3);
        const aiData = res.content || [];
        setAiWorcations(Array.isArray(aiData) ? aiData : aiData ? [aiData] : []);
      } catch (err) {
        console.error('AI 리스트 로드 실패', err);
        setAiWorcations([]);
      } finally {
        setAiLoading(false);
      }
    };
    fetchAi();
  }, [loginUser]);

  useEffect(() => {
    setPopularKeywords(worcations.slice(0, 5).map((w) => w.worcation_name));
  }, [worcations, setPopularKeywords]);

  // 검색어가 있으면 전체 리스트 페이지로 이동
  useEffect(() => {
    if (keyword.trim() !== '') {
      navigate('/worcation');
    }
  }, [keyword, navigate]);

  // AI 워케이션 데이터 처리
  const processedAiWorcations = (aiWorcations || []).map((item) => ({
    ...item,
    // WorcationDto.Simple 구조에 맞게 필드 매핑
    worcation_name: item.worcation_name,
    worcation_address: item.worcation_address,
    mainPhoto: item.main_change_photo,
    photos: item.main_change_photo ? [{ image_url: item.main_change_photo }] : [],
    // 기타 필요한 필드들 추가
    worcation_category: item.worcation_category,
    worcation_thema: item.worcation_thema,
    // WorcationCardList에서 사용하는 필드들
    address: item.worcation_address, // 검색 필터링용
    reviews: [], // 리뷰 정보가 없으므로 빈 배열로 설정
    status: 'Y', // AI 추천 워케이션은 활성 상태로 설정
  }));

  // 필터링된 워케이션 (검색어가 없을 때만)
  const filteredWorcations = keyword.trim() === '' ? worcations : [];
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
              .slice(0, 3)
              .map((matchedWorcation) => (
                <PartnerCard key={matchedWorcation.worcation_no}>
                  <picture>
                    <source srcSet={matchedWorcation.main_change_photo + '.webp'} type="image/webp" />
                    <PartnerImage
                      src={matchedWorcation.main_change_photo}
                      alt={matchedWorcation.worcation_name}
                      onClick={() => navigate(`/worcation/${matchedWorcation.worcation_no}`)}
                      loading="lazy"
                    />
                  </picture>
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

      {(loginUser || aiWorcations.length > 0) && (
        <>
          <SectionTitle>AI 추천</SectionTitle>
          <CardList style={{ position: 'relative', minHeight: '200px' }}>
            {aiLoading && (
              <AiLoadingOverlay>
                <AiOutlineLoading3Quarters className="spinner" size={40} color="#FFD600" />
              </AiLoadingOverlay>
            )}
            {!aiLoading && processedAiWorcations.length > 0 ? (
              <WorcationCardList data={processedAiWorcations.slice(0, 3)} navigate={navigate} />
            ) : (
              <NoAiRecommendation>
                {loginUser ? 'AI 추천 워케이션이 준비 중입니다.' : '로그인하면 AI 추천 워케이션을 받을 수 있습니다.'}
              </NoAiRecommendation>
            )}
          </CardList>
        </>
      )}

      <SectionTitle>
        인기명소 <span style={{ fontSize: '16px', fontWeight: 'normal' }}>(Top10)</span>
      </SectionTitle>
      <WorcationCardList
        data={sortedWorcations.slice(0, 10).map((item) => ({
          ...item,
          mainPhoto: item.main_change_photo,
        }))}
        navigate={navigate}
      />
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

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  .spinner {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;
const AiLoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  .spinner {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

const NoAiRecommendation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px; /* Adjust height as needed */
  background-color: #f0f0f0;
  border-radius: ${({ theme }) => theme.borderRadius['lg']};
  padding: 20px;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes['md']};
  color: #555;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;
