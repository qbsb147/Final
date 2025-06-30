import api from './axios';
import { API_BUSINESS, API_ENDPOINTS } from './config';

export const worcationService = {
  listAll : async() =>{
    const response = await api.get(API_ENDPOINTS.WORCATION);
    return response.data;
  },

};
