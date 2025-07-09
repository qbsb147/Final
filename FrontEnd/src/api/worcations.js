import api from './axios';
import { API_CONFIG, API_ENDPOINTS } from './config';

export const worcationService = {
  list: async () => {
    const response = await api.get(API_ENDPOINTS.WORCATION.LIST);
    return response.data;
  },

  getDetail: async (worcation_no) => {
    const response = await api.get(API_ENDPOINTS.WORCATION.DETAIL(worcation_no));
    return response.data;
  },
  addReview: async (review) => {
    const response = await api.post(API_ENDPOINTS.REVIEW.ADD, review);
    return response.data;
  },
  save: async () => {
    const response = await api.get(API_ENDPOINTS.WORCATION.SAVE);
    return response.data;
  },
  update: async () => {
    const response = await api.patch(API_ENDPOINTS.WORCATION.UPDATE);
    return response.data;
  },
  delete: async () => {
    const response = await api.delete(API_ENDPOINTS.WORCATION.DELETE);
    return response.data;
  },

  updateReview: async (review_no, reviewData) => {
    const response = await api.patch(API_ENDPOINTS.REVIEW.UPDATE(review_no), reviewData, {
      headers: { ...API_CONFIG.HEADERS },
    });
    return response.data;
  },
  deleteReview: async (review_no) => {
    const response = await api.delete(API_ENDPOINTS.REVIEW.DELETE(review_no));
    return response.data;
  },
  applicationList: async () => {
    const response = await api.get(API_ENDPOINTS.APPLICATION.LIST);
    return response.data;
  },
  validate: async (b_no) => {
    const response = await api.post(API_ENDPOINTS.WORCATION.VALIDATE(), { b_no });
    return response.data;
  },

  WorcationName: async (userNo) => {
    const response = await api.get(API_ENDPOINTS.WORCATION.WORCATIONNAME(userNo));
    return response.data;
  },

  WorcationReservation: async (userNo) => {
    const response = await api.get(API_ENDPOINTS.WORCATION.WORCATIONRESERVATION(userNo));
    return response.data;
  },
  getMyList: async (user_no) => {
    const response = await api.get(API_ENDPOINTS.WORCATION.GETMYLIST(user_no));

    return response.data;
  },
};
