import axiosInstance from './axios';
import { API_END_POINT } from './config';

//데이터 가져오기(예시)
export const getProducts = async () => {
  try {
    const { data } = await axiosInstance.get(API_END_POINT.PRODUCT);
    return data;
  } catch (error) {
    console.log('상품정보를 가져오지 못했습니다.', error);
    throw error;
  }
};
