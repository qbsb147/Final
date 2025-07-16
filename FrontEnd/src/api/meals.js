import axiosInstance from './axios';
import { API_ENDPOINTS } from './config';

export const mealService = {
  checked: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.MEALS.CHECK);
      return response.data;
    } catch (error) {
      throw error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    }
  },
};
