import React, { useEffect, useState } from 'react';
import { worcationService } from '../../api/worcations';
import { useAiStore } from '../../store/aiStore';
import WorcationCardList from '../../components/worcation/WorcationCardList';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ButtonBorder, ButtonDetail } from '../../styles/Button.styles';
import useSearchStore from '../../store/useSearchStore';
import useAuthStore from '../../store/authStore';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

const WorcationAiPage = () => {
  const [worcations, setWorcations] = useState([]);
  const { 
    aiWorcations, 
    aiLoading, 
    fetchAiWorcations, 
    currentPage, 
    totalPages, 
    totalElements, 
    pageSize,
    setCurrentPage 
  } = useAiStore();
  const [viewMode, setViewMode] = useState('ai');
  const keyword = useSearchStore((state) => state.keyword);
  const loginUser = useAuthStore((state) => state.loginUser);
  const navigate = useNavigate();
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
    if (loginUser) fetchAiWorcations(worcationService, currentPage, pageSize);
  }, [loginUser, fetchAiWorcations, currentPage, pageSize]);

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getFilteredWorcations = () => {
    let filtered = worcations;
    if (viewMode === 'partner') {
      filtered = filtered.filter((w) => w.partners && w.partners.some((p) => p.approve === 'Y'));
    }
    if (viewMode === 'ai') {
      // AI 워케이션 데이터 처리 - 백엔드 응답 구조에 맞게 수정
      filtered = (aiWorcations || []).map(item => ({
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
      }));
    }
    if (keyword.trim() !== '') {
      filtered = filtered.filter(
        (w) => (w.worcation_name && w.worcation_name.includes(keyword)) || (w.address && w.address.includes(keyword))
      );
    }
    return Array.isArray(filtered) ? filtered : [];
  };

  const handleToggleView = (mode) => {
    if (viewMode === mode) {
      setViewMode('all');
    } else {
      setViewMode(mode);
      if (mode === 'ai') {
        setCurrentPage(0);
      }
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
        <>
          <WorcationCardList data={getFilteredWorcations().map(item => ({
            ...item,
            mainPhoto: item.mainPhoto || item.main_change_photo,
          }))} navigate={navigate} />
          
          {/* 페이징네이션 */}
          {viewMode === 'ai' && totalPages > 1 && (
            <PaginationContainer>
              <PaginationInfo>
                총 {totalElements}개의 워케이션 중 {(currentPage * pageSize) + 1} - {Math.min((currentPage + 1) * pageSize, totalElements)}번째
              </PaginationInfo>
              <PaginationControls>
                <PageButton 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  <AiOutlineLeft />
                </PageButton>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i;
                  } else if (currentPage < 3) {
                    pageNum = i;
                  } else if (currentPage > totalPages - 3) {
                    pageNum = totalPages - 5 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <PageButton
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      active={currentPage === pageNum}
                    >
                      {pageNum + 1}
                    </PageButton>
                  );
                })}
                
                <PageButton 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                >
                  <AiOutlineRight />
                </PageButton>
              </PaginationControls>
            </PaginationContainer>
          )}
        </>
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 10px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const PaginationInfo = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const PageButton = styled.button`
  background-color: ${({ theme, active }) => active ? theme.colors.primary : 'transparent'};
  color: ${({ theme, active }) => active ? theme.colors.white : theme.colors.textPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.white};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  svg {
    vertical-align: middle;
  }
`;
