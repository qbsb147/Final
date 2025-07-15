import api from './axios';
import { API_CONFIG, API_ENDPOINTS } from './config';

export const applicationService = {
  create: async (application) => {
    const response = await api.post(API_ENDPOINTS.APPLICATION.CREATE, application);
    return response.data;
  },
  reserved_worcation: async (worcation_no) => {
    const response = await api.get(API_ENDPOINTS.APPLICATION.RESERVED_WORCATION(worcation_no));
    return response.data;
  },
  // 예약 목록 조회
  reserved: async (user_no) => {
    const response = await api.get(API_ENDPOINTS.APPLICATION.RESERVED(user_no));
    return response.data;
  },
  // 이용완료 목록 조회
  used: async (user_no) => {
    const response = await api.get(API_ENDPOINTS.APPLICATION.USED(user_no));
    return response.data;
  },
  delete: async (application_no) => {
    const response = await api.delete(API_ENDPOINTS.APPLICATION.DELETE(application_no));
    return response.data;
  },
  date_count: async (worcation_no) => {
    const response = await api.get(API_ENDPOINTS.APPLICATION.DATE_COUNT(worcation_no));
    return response.data;
  },
  // 예약 불가능한 날짜 목록 조회 (예: 캘린더에서 사용)
  getFullDates: async (worcation_no, startDate, endDate) => {
    console.log('워케이션 넘버 확인:', worcation_no);
    const res = await api.get(
      API_ENDPOINTS.APPLICATION.GET_FULL_DATES({ worcationNo: worcation_no, startDate, endDate })
    );
    worcation_no;
    return res.data;
  },
  getRemainingByWorcation: async (worcation_no, startDate, endDate) => {
    const res = await api.get(
      API_ENDPOINTS.APPLICATION.GET_REMAINING_DATES({ worcationNo: worcation_no, startDate, endDate })
    );
    return res.data;
  },
};
