import api from './axios';
import { API_ENDPOINTS } from './config';

export const mentalService = {
  postStress: async (stressData, user_no) => {
    console.log('user_no : ', user_no);
    try {
      const { data } = await api.post(API_ENDPOINTS.MENTALS.STRESS, {
        ...stressData,
        user_no,
      });

      return data;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '스트레스 검사를 내역을 제출하지 못했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },
  postBurnout: async (burnoutData, user_no) => {
    try {
      const { data } = await api.post(API_ENDPOINTS.MENTALS.BURNOUT, {
        burnout: burnoutData,
        user_no,
      });

      return data;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '번아웃 검사를 내역을 제출하지 못했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },
  postTendency: async (tendencyData, user_no) => {
    try {
      const { data } = await api.post(API_ENDPOINTS.MENTALS.TENDENCY, {
        tendency: tendencyData,
        user_no: user_no,
      });

      return data;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '성향검사를 내역을 제출하지 못했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },
};
