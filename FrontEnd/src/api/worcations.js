import api from './axios';
import { API_BUSINESS, API_ENDPOINTS } from './config';

export const worcationService = {
  //회원가입
  validation: async (validationData) => {
    try {
      const { data } = await api.post(API_BUSINESS.BUSINESS_VALIDATE, {
        licensee: validationData.licensee,
        worcation_name: validationData.worcation_name,
        open_date: validationData.open_date,
        business_id: validationData.business_id,
      });

      return data;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '진위 여부 확인에 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },

  // insert: async(user_no, insertData) => {
  //   try{
  //     const {data} = await api.post(API_ENDPOINTS.WORCATION(user_no))
  //   }
  // }
};
