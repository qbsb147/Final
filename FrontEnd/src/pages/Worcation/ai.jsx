import React, { useEffect, useState } from 'react';
import { worcationService } from '../../api/worcations';
import WorcationCardList from '../../components/worcation/WorcationCardList';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ButtonBorder, ButtonDetail } from '../../styles/Button.styles';
import useSearchStore from '../../store/useSearchStore';
import useAuthStore from '../../store/authStore';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const WorcationAiPage = () => {
  const [worcations, setWorcations] = useState([]);
  const [aiWorcations, setAiWorcations] = useState([]);
  const [viewMode, setViewMode] = useState('ai');
  const keyword = useSearchStore((state) => state.keyword);
  const loginUser = useAuthStore((state) => state.loginUser);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await worcationService.list();
      // 각 워케이션에 mainPhoto(S3 URL) 필드 추가
      const processedList = data.map((w) => {
        let sortedPhotos = w.photos ? [...w.photos] : [];
        sortedPhotos.sort((a, b) => a.photo_no - b.photo_no);
        return {
          ...w,
          mainPhoto: sortedPhotos.length > 0 ? sortedPhotos[0].image_url : null,
        };
      });
      setWorcations(processedList);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchAiData = async () => {
      if (!loginUser) return;
      setAiLoading(true);
      const aiRes = await worcationService.getGPT(loginUser.user_no);
      const worcationNo = aiRes.recommendations.map((r) => r.worcation_no);
      const aiData = await worcationService.getDetail(worcationNo);
      setAiWorcations(Array.isArray(aiData) ? aiData : [aiData]);
      setAiLoading(false);
    };
    fetchAiData();
  }, [loginUser]);

  const getFilteredWorcations = () => {
    let filtered = worcations;
    if (viewMode === 'partner') {
      filtered = filtered.filter((w) => w.partners && w.partners.some((p) => p.approve === 'Y'));
    }
    if (viewMode === 'ai') {
      filtered = aiWorcations;
    }
    if (keyword.trim() !== '') {
      filtered = filtered.filter(
        (w) => (w.worcation_name && w.worcation_name.includes(keyword)) || (w.address && w.address.includes(keyword))
      );
    }
    return filtered;
  };

  const handleToggleView = (mode) => {
    if (viewMode === mode) {
      setViewMode('all');
    } else {
      setViewMode(mode);
    }
  };

  const setPopularKeywords = useSearchStore((state) => state.setPopularKeywords);
  useEffect(() => {
    setPopularKeywords(worcations.slice(0, 5).map((w) => w.worcation_name));
  }, [worcations, setPopularKeywords]);

  if (loading) {
    return (
      <LoadingOverlay>
        <AiOutlineLoading3Quarters className="spinner" size={80} color="#FFD600" />
      </LoadingOverlay>
    );
  }

  return (
    <Container>
      <ButtonWrapper>
        <ButtonBorder onClick={() => handleToggleView('partner')}>
          {viewMode === 'partner' ? '전체 보기' : '제휴 업체 보기'}
        </ButtonBorder>
        <ButtonBorder onClick={() => handleToggleView('ai')}>
          {viewMode === 'ai' ? '전체 보기' : 'AI 추천'}
        </ButtonBorder>
      </ButtonWrapper>

      <SectionTitle>
        {{ all: '전체 리스트 보기', partner: '제휴 업체 보기', ai: 'AI 추천 제휴 업체' }[viewMode]}
      </SectionTitle>
      {viewMode === 'ai' && aiLoading ? (
        <LoadingOverlay>
          <AiOutlineLoading3Quarters className="spinner" size={80} color="#FFD600" />
        </LoadingOverlay>
      ) : (
        <WorcationCardList data={getFilteredWorcations()} navigate={navigate} />
      )}
    </Container>
  );
};

export default WorcationAiPage;

const Container = styled.div`
  border-top: 2px solid ${({ theme }) => theme.colors.brown};
  border-bottom: 2px solid ${({ theme }) => theme.colors.brown};
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  padding: 3% 5%;
  text-align: left;
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
