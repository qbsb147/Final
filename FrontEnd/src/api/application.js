import api from './axios';
import { API_CONFIG, API_ENDPOINTS } from './config';

export const applicationService = {
  create: async () => {
    const response = await api.post(API_ENDPOINTS.APPLICATION.CREATE);
    return response.data;
  },
reserved_worcation: async (worcation_no) => {
  const response = await api.get(API_ENDPOINTS.APPLICATION.RESERVED_WORCATION(worcation_no));
  return response.data;
};
  //예약 목록 조회
  reserved: async (user_no) => {
    const response = await api.get(API_ENDPOINTS.APPLICATION.RESERVED, {
      params: { user_no },
    });
    return response.data;
  },

  // 이용완료 목록 조회
  used: async (user_no) => {
    const response = await api.get(API_ENDPOINTS.APPLICATION.USED, {
      params: { user_no },
    });
    return response.data;
  },
  delete: async (application_no) => {
    const response = await api.delete(API_ENDPOINTS.APPLICATION.DELETE(application_no));
    return response.data;
  },
};
