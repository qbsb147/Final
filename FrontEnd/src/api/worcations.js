import api from './axios';
import { API_BUSINESS, API_ENDPOINTS } from './config';

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

  temporary_save: async () => {
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
};
