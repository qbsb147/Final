import api from './axios';
import { API_CONFIG, API_ENDPOINTS } from './config';

export const partnerService = {
  create: async (formData) => {
    const response = await api.post(API_ENDPOINTS.PARTNER.CREATE, formData);
    return response.data;
  },
  getAllRequests: async (user_no) => {
    const response = await api.get(API_ENDPOINTS.PARTNER.GETALLREQUESTS, user_no);
    return response.data;
  },
  approve: async (partner_no) => {
    const response = await api.put(API_ENDPOINTS.PARTNER.UPDATE_STATUS(partner_no), {
      approve: 'Y',
    });
    return response.data;
  },

  reject: async (partner_no) => {
    const response = await api.put(API_ENDPOINTS.PARTNER.UPDATE_STATUS(partner_no), {
      approve: 'N',
    });
    return response.data;
  },
};
