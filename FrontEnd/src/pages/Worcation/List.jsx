import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ButtonBorder } from '../../styles/Button.styles';
import { useNavigate } from 'react-router-dom';
import { worcationService } from '../../api/worcations';
import { useAiStore } from '../../store/aiStore';
import WorcationCardList from '../../components/worcation/WorcationCardList';
import useSearchStore from '../../store/useSearchStore';
import useAuthStore from '../../store/authStore';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const WorcationList = () => {
  const [viewMode, setViewMode] = useState('all');
  const navigate = useNavigate();
  const [worcations, setWorcations] = useState([]);
  const keyword = useSearchStore((state) => state.keyword);
  const setPopularKeywords = useSearchStore((state) => state.setPopularKeywords);
  const { aiWorcations, aiLoading, fetchAiWorcations } = useAiStore();
  const loginUser = useAuthStore((state) => state.loginUser);
  const [loading, setLoading] = useState(true);

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
      setTimeout(() => setLoading(false), 100);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setPopularKeywords(worcations.slice(0, 5).map((w) => w.worcation_name));
  }, [worcations, setPopularKeywords]);

  useEffect(() => {
    if (loginUser) fetchAiWorcations(loginUser.user_no, worcationService);
  }, [loginUser, fetchAiWorcations]);

  const handleToggleView = (mode) => {
    if (mode === 'partner') {
      navigate('/worcation/partners');
      return;
    }
    if (viewMode === mode) {
      setViewMode('all');
    } else {
      setViewMode(mode);
    }
  };

  const getFilteredWorcations = () => {
    let filtered = worcations;
    if (viewMode === 'all') {
      filtered = filtered.filter((w) => w.status === 'Y');
    }
    if (viewMode === 'partner') {
      filtered = filtered.filter((w) => w.partners && w.partners.some((p) => p.approve === 'Y'));
    }
    if (viewMode === 'ai') {
      filtered = aiWorcations || [];
    }
    if (keyword.trim() !== '') {
      filtered = filtered.filter(
        (w) => (w.worcation_name && w.worcation_name.includes(keyword)) || (w.address && w.address.includes(keyword))
      );
    }
    return Array.isArray(filtered) ? filtered : [];
  };

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

export default WorcationList;

const Container = styled.div`
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  padding: 3% 5%;
  text-align: left;
  margin-top: 2%;
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
