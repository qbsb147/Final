import api, { fileApi } from './axios';
import { API_CONFIG, API_ENDPOINTS, IMG_CONFIG } from './config';

export const worcationService = {
  list: async () => {
    const response = await api.get(API_ENDPOINTS.WORCATION.LIST);
    return response.data;
  },
  getMyWorcationList: async (user_no) => {
    const response = await api.get(API_ENDPOINTS.WORCATION.LISTALL(user_no));
    return response.data;
  },

  getDetail: async (worcation_no) => {
    const response = await api.get(API_ENDPOINTS.WORCATION.DETAIL(worcation_no));
    return response.data;
  },
  addReview: async (review) => {
    const response = await api.post(API_ENDPOINTS.REVIEW.ADD, review);
    return response.data;
  },
  save: async (data) => {
    const response = await api.post(API_ENDPOINTS.WORCATION.SAVE, data);
    return response.data;
  },
  saveTmpWorcation: async (payload) => {
    const response = await api.post(API_ENDPOINTS.WORCATION.SAVETMP, payload);
    return response.data;
  },

  update: async (worcation_no, data) => {
    const response = await api.patch(API_ENDPOINTS.WORCATION.UPDATE(worcation_no), data);
    return response.data;
  },
  delete: async (worcation_no) => {
    const response = await api.delete(API_ENDPOINTS.WORCATION.DELETE(worcation_no));
    return response.data;
  },

  updateReview: async (review_no, reviewData) => {
    const response = await api.patch(API_ENDPOINTS.REVIEW.UPDATE(review_no), reviewData, {
      headers: { ...API_CONFIG.HEADERS },
    });
    return response.data;
  },
  deleteReview: async (review_no) => {
    const response = await api.delete(API_ENDPOINTS.REVIEW.DELETE(review_no));
    return response.data;
  },
  applicationList: async () => {
    const response = await api.get(API_ENDPOINTS.APPLICATION.LIST);
    return response.data;
  },
  validate: async (b_no) => {
    const response = await api.post(API_ENDPOINTS.WORCATION.VALIDATE(), { b_no });
    return response.data;
  },

  WorcationName: async (user_no) => {
    const response = await api.get(API_ENDPOINTS.WORCATION.WORCATIONNAME(user_no));
    return response.data;
  },

  WorcationReservation: async (user_no, page = 0, size = 15) => {
    const response = await api.get(API_ENDPOINTS.WORCATION.WORCATIONRESERVATION(user_no), {
      params: { page, size },
    });
    return response.data;
  },
  getMyList: async (user_no) => {
    const response = await api.get(API_ENDPOINTS.WORCATION.GETMYLIST(user_no));
    return response.data;
  },
  uploadImage: async (file, folder = 'images') => {
    const formData = new FormData();

    // 고유한 파일명 생성
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `worcation_${timestamp}_${randomString}.${fileExtension}`;

    // 새로운 파일명으로 Blob 생성
    const renamedFile = new File([file], uniqueFileName, { type: file.type });
    formData.append('file', renamedFile);
    formData.append('folder', folder);

    const response = await fileApi.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.imageUrl; // 업로드된 파일 URL 반환 (images/파일명)
  },

  deleteImage: async (imageUrl) => {
    try {
      const response = await fileApi.delete('/files/delete', {
        params: { imageUrl },
      });
      return response.data;
    } catch (error) {
      console.error('이미지 삭제 실패:', error);
      throw new Error('이미지 삭제에 실패했습니다.');
    }
  },
  getAI: async (worcation_no) => {
    const response = await api.get(`/worcations/ids?ids=${worcation_no}`);
    return response.data;
  },
  getAIList: async (page = 0, size = 10) => {
    console.log('🚀 getAIList 호출됨 - 페이지:', page, '크기:', size);
    console.log('📡 API 엔드포인트:', API_ENDPOINTS.WORCATION.AI);
    console.log('🔗 전체 URL:', `${import.meta.env.VITE_API_URL}/api/v1${API_ENDPOINTS.WORCATION.AI}`);
    
    try {
      const response = await api.get(API_ENDPOINTS.WORCATION.AI, {
        params: { page, size }
      });
      console.log('✅ getAIList 응답 성공:', response);
      return response.data;
    } catch (error) {
      console.error('❌ getAIList 에러:', error);
      throw error;
    }
  },
};
