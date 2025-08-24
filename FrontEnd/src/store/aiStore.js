import { create } from 'zustand';

export const useAiStore = create((set) => ({
  aiWorcations: [],
  aiLoading: false,
  // 페이징 정보 추가
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  pageSize: 10,
  
  fetchAiWorcations: async (worcationService, page = 0, size = 10) => {
    set({ aiLoading: true });
    try {
      console.log('🚀 AI 워케이션 조회 시작:', { page, size });
      
      const aiResponse = await worcationService.getAIList(page, size);
      
      console.log('🔍 AI 응답 데이터 전체:', aiResponse);
      console.log('🔍 AI 응답 타입:', typeof aiResponse);
      console.log('🔍 AI 응답 키들:', Object.keys(aiResponse || {}));
      
      // PageResponse 구조에 맞게 데이터 추출
      const aiData = aiResponse.content || aiResponse;
      console.log('🔍 추출된 AI 데이터:', aiData);
      
      const newState = {
        aiWorcations: Array.isArray(aiData) ? aiData : aiData ? [aiData] : [], 
        aiLoading: false,
        currentPage: aiResponse.currentPage || page,
        totalPages: aiResponse.totalPage || 0,        // totalPage 필드명 맞춤
        totalElements: aiResponse.totalCount || 0,    // totalCount 필드명 맞춤
        pageSize: size
      };
      
      console.log('🔍 설정할 새 상태:', newState);
      set(newState);
      
    } catch (error) {
      console.error('❌ AI 워케이션 조회 실패:', error);
      console.error('❌ 에러 상세:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      set({ aiWorcations: [], aiLoading: false });
    }
  },
  
  // 페이지 변경 함수
  setCurrentPage: (page) => {
    set({ currentPage: page });
  },
}));
