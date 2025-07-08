import api from './axios';
import { API_ENDPOINTS } from './config';

export const mentalService = {
  postStress: async ({ stress, user_no }) => {
    try {
      //스프링 구현하면 살릴 내용//
      // const { data } = await api.post(API_ENDPOINTS.MENTALS.STRESS, {
      //   stress: stress,
      //   user_no,
      // });
      // return data;

      //스프링 구현하면 살릴 내용//

      //스프링 구현하면 지울 내용//
      await api.post(API_ENDPOINTS.MENTALS.STRESS, {
        stress: stress,
        user_no,
      });
      const { data } = await api.get(API_ENDPOINTS.MENTALS.BASE(1));
      return data[0];
      //스프링 구현하면 지울 내용//
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '스트레스 검사를 내역을 제출하지 못했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },
  postBurnout: async ({ burnout, user_no }) => {
    try {
      //스프링 구현하면 살릴 내용//
      // const { data } = await api.post(API_ENDPOINTS.MENTALS.BURNOUT, {
      //   burnout: burnout,
      //   user_no,
      // });
      //스프링 구현하면 살릴 내용//

      //스프링 구현하면 지울 내용//
      await api.post(API_ENDPOINTS.MENTALS.BURNOUT, {
        burnout: burnout,
        user_no,
      });
      const { data } = await api.get(API_ENDPOINTS.MENTALS.BASE(2));
      return data[0];
      //스프링 구현하면 지울 내용//
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '스트레스 검사를 내역을 제출하지 못했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },
  getMental: async (user_no) => {
    const response = await api.get(API_ENDPOINTS.MENTALS(user_no));
    return response;
  },

};
