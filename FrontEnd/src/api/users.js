import api from './axios';
import { API_ENDPOINTS } from './config';

export const userService = {
  //회원가입
  signUp: async (userData) => {
    console.log('????');
    try {
      const { data } = await api.post(API_ENDPOINTS.USERS.BASE, {
        email: userData.email,
        password: userData.password,
        username: userData.username,
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return data;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '회원가입에 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },
  login: async (email, password) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.USERS.LOGIN(email, password));
      return data[0]; //
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '로그인에 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },
};
