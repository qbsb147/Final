import api from './axios';
import { API_ENDPOINTS } from './config';

export const memberPreferenceService = {
  postTendency: async ({ tendency, user_no }) => {
    try {
      //스프링 구현하면 살릴 내용//
      // const { data } = await api.post(API_ENDPOINTS.MEMBER_TENDENCY, {
      //   tendency: tendency,
      //   user_no,
      // });
      //스프링 구현하면 살릴 내용//

      //스프링 구현하면 지울 내용//
      await api.post(API_ENDPOINTS.MEMBER_PREFERENCE, {
        ...tendency,
        user_no,
      });
      const { data } = await api.get(API_ENDPOINTS.MEMBER_PREFERENCE_GET(1));
      return data[0];
      //스프링 구현하면 지울 내용//
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '성향 검사를 내역을 제출하지 못했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },
};
