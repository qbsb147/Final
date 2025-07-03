import api from './axios';
import { API_CONFIG, API_ENDPOINTS } from './config';

export const applicationService = {
  //예약 목록 조회
  reserved: async (user_no) => {
    const response = await api.get('/applications/reserved', {
      params: { user_no },
    });
    return response.data;
  },

  // 이용완료 목록 조회
  used: async (user_no) => {
    const response = await api.get('/applications/used', {
      params: { user_no },
    });
    return response.data;
  },
  delete: async (application_no) => {
    const response = await api.delete(API_ENDPOINTS.APPLICATION.DELETE(application_no));
    return response.data;
  },
};
