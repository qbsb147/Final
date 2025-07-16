import React, { useEffect, useState } from 'react';
import { worcationService } from '../../api/worcations';
import WorcationCardList from '../../components/worcation/WorcationCardList';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ButtonBorder, ButtonDetail } from '../../styles/Button.styles';
import useSearchStore from '../../store/useSearchStore';

const WorcationAiPage = () => {
  const [worcations, setWorcations] = useState([]);
  const [viewMode, setViewMode] = useState('ai');
  const keyword = useSearchStore((state) => state.keyword);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
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
    };
    fetchData();
  }, []);

  const getFilteredWorcations = () => {
    let filtered = worcations;
    if (viewMode === 'partner') {
      filtered = filtered.filter((w) => w.partners && w.partners.some((p) => p.approve === 'Y'));
    }
    if (viewMode === 'ai') {
      // AI 추천 필터링 로직이 있다면 여기에 적용
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
      <WorcationCardList data={getFilteredWorcations()} navigate={navigate} />
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
