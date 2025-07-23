import axiosInstance from './axios';
import { API_ENDPOINTS } from './config';

export const mentalService = {
  postStress: async (stress) => {
    try {
      const { data } = await axiosInstance.post(API_ENDPOINTS.MENTALS.STRESS, stress, { timeout: 30000 });
      return data;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '스트레스 검사 내역을 제출하지 못했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },
  postBurnout: async (burnout) => {
    try {
      await axiosInstance.post(API_ENDPOINTS.MENTALS.BURNOUT, burnout, { timeout: 30000 });
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '스트레스 검사 내역을 제출하지 못했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },
  postPreference: async (preference) => {
    try {
      await axiosInstance.post(API_ENDPOINTS.MENTALS.PREFERENCE, preference, { timeout: 30000 });
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '성향 검사 내역을 제출하지 못했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },

  getMentals: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.MENTALS.BASE, { timeout: 30000 });
      return response.data;
    } catch (error) {
      throw error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    }
  },

  getMainMental: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.MENTALS.MAIN, { timeout: 30000 });
      return response.data;
    } catch (error) {
      throw error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    }
  },
};
