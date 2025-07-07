import axiosInstance from './axios';
import { API_ENDPOINTS } from './config';

//로그인
const healthService = {
  getHealth: async () => {
    try {
      const { data } = await axiosInstance.get(API_ENDPOINTS.HEALTH.BASE);
      return data;
    } catch (error) {
      throw error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    }
  },

  saveHealth: async (formData) => {
    try {
      const { data } = await axiosInstance.post(API_ENDPOINTS.HEALTH.BASE, formData);
      return data;
    } catch (error) {
      throw error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    }
  },

  updateHealth: async (formData) => {
    try {
      const { data } = await axiosInstance.put(API_ENDPOINTS.HEALTH.BASE, formData);
      return data;
    } catch (error) {
      throw error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    }
  },
};
export default healthService;
