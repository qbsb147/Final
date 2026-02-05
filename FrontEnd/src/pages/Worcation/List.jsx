import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ButtonBorder } from '../../styles/Button.styles';
import { useNavigate } from 'react-router-dom';
import { worcationService } from '../../api/worcations';
import WorcationCardList from './components/WorcationCardList';
import useSearchStore from '../../store/useSearchStore';
import useAuthStore from '../../store/authStore';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Pagination from '../../components/common/Pagination';

const WorcationList = () => {
  const [viewMode, setViewMode] = useState('all');
  const navigate = useNavigate();
  const [worcations, setWorcations] = useState([]);
  // allWorcations is used if backend returns full array (no pagination)
  const [allWorcations, setAllWorcations] = useState([]);
  const keyword = useSearchStore((state) => state.keyword);
  const setPopularKeywords = useSearchStore((state) => state.setPopularKeywords);
  const [aiWorcations, setAiWorcations] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const loginUser = useAuthStore((state) => state.loginUser);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 12; // default page size for 전체보기

  // AI fetch helper (local)
  const fetchAi = React.useCallback(
    async (page = 0, size = 10) => {
      if (!loginUser) return;
      setAiLoading(true);
      try {
        const res = await worcationService.getAIList(page, size);
        const aiData = res.content || [];
        setAiWorcations(Array.isArray(aiData) ? aiData : aiData ? [aiData] : []);
      } catch (err) {
        console.error('AI 리스트 로드 실패', err);
        setAiWorcations([]);
      } finally {
        setAiLoading(false);
      }
    },
    [loginUser]
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await worcationService.list(currentPage, pageSize);

        // If backend returns paginated response (content + pagination fields)
        if (res && res.content) {
          const data = res.content;
          const processedList = data.map((w) => {
            let sortedPhotos = w.photos ? [...w.photos] : [];
            sortedPhotos.sort((a, b) => a.photo_no - b.photo_no);
            return {
              ...w,
              mainPhoto: sortedPhotos.length > 0 ? sortedPhotos[0].image_url : null,
            };
          });
          setWorcations(processedList);
          // backend may use snake_case names
          const tp = res.total_page || res.totalPages || Math.ceil((res.total_elements || res.totalElements || res.total || (res.totalElementsCount || 0)) / pageSize);
          setTotalPages(tp || 0);
        } else if (Array.isArray(res)) {
          // fallback: backend returned full array (no pagination)
          const processed = res.map((w) => {
            let sortedPhotos = w.photos ? [...w.photos] : [];
            sortedPhotos.sort((a, b) => a.photo_no - b.photo_no);
            return {
              ...w,
              mainPhoto: sortedPhotos.length > 0 ? sortedPhotos[0].image_url : null,
            };
          });
          setAllWorcations(processed);
          const pages = Math.ceil(processed.length / pageSize) || 1;
          setTotalPages(pages);
          // slice the array for the current page
          const paged = processed.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
          setWorcations(paged);
        } else {
          // unknown structure - clear
          setWorcations([]);
          setTotalPages(0);
        }
      } catch (err) {
        console.error('워케이션 리스트 로드 실패', err);
        setWorcations([]);
        setTotalPages(0);
      } finally {
        setTimeout(() => setLoading(false), 100);
      }
    };
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    // prefer popular keywords from full list if available
    const source = allWorcations.length > 0 ? allWorcations : worcations;
    setPopularKeywords((source || []).slice(0, 5).map((w) => w.worcation_name));
  }, [worcations, allWorcations, setPopularKeywords]);

  useEffect(() => {
    fetchAi(0, 10);
  }, [fetchAi]);

  const handleToggleView = (mode) => {
    if (mode === 'partner') {
      navigate('/worcation/partners');
      return;
    }
    if (viewMode === mode) {
      setViewMode('all');
    } else {
      setViewMode(mode);
      // AI 모드로 전환할 때 AI 워케이션 조회
      if (mode === 'ai' && loginUser) {
        fetchAi(0, 10);
      }
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
      // AI 워케이션 데이터 처리 - 백엔드 응답 구조에 맞게 수정
      filtered = (aiWorcations || []).map((item) => ({
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
    }
    if (keyword.trim() !== '') {
      filtered = filtered.filter(
        (w) =>
          (w.worcation_name && w.worcation_name.includes(keyword)) ||
          (w.worcation_address && w.worcation_address.includes(keyword))
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
        <>
          <WorcationCardList data={getFilteredWorcations()} navigate={navigate} />
          {/* show pagination for 전체보기 (not AI) */}
          {viewMode === 'all' && totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
          )}
        </>
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
