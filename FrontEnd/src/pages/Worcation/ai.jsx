import React, { useEffect, useState } from 'react';
import { worcationService } from '../../api/worcations';
import WorcationCardList from '../../components/worcation/WorcationCardList';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ButtonBorder, ButtonDetail } from '../../styles/Button.styles';
import useWorcationStore from '../../store/worcationStore';

const WorcationAiPage = () => {
  const [worcations, setWorcations] = useState([]);
  const [viewMode, setViewMode] = useState('ai');
  const keyword = useWorcationStore((state) => state.keyword);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await worcationService.list();
      setWorcations(data);
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

  const setPopularKeywords = useWorcationStore((state) => state.setPopularKeywords);
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
