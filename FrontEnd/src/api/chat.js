import axiosInstance from './axios';
import { API_ENDPOINTS } from './config';

export const chatService = {
  addWorcationChat: async (worcation_no) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.CHAT.ADD_WORCATION(worcation_no));
      return response.data;
    } catch (error) {
      console.log('error', error);
      throw error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    }
  },
  chatList: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.CHAT.LIST);
      return response.data;
    } catch (error) {
      console.log('error', error);
      throw error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    }
  },
  getMessageList: async (room_no, { page = 0 } = {}) => {
    try {
      const params = {
        page: page,
      };
      const response = await axiosInstance.get(API_ENDPOINTS.CHAT.MESSAGE_LIST(room_no), { params });
      return response.data;
    } catch (error) {
      console.log('error', error);
      throw error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    }
  },

  getParticipantsCount: async (room_no) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.CHAT.PARTICIPANTS_COUNT(room_no));
      return response.data;
    } catch (error) {
      console.log('error', error);
      throw error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    }
  },
};
