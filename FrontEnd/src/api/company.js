import axiosInstance from './axios';
import { API_ENDPOINTS } from './config';

export const companyEmployee = {
  //직원 조회
  getEmployeeList: async (companyNo) => {
    try {
      const { data } = await axiosInstance.get(API_ENDPOINTS.COMPANY_EMPLOYEE.EMPLOYEE_LIST(companyNo));
      return data;
    } catch (error) {
      const message = error.response?.data?.message || '직원 리스트 불러오기 실패';
      throw new Error(message);
    }
  },
  //등급변환
  updateRole: async (userNo, newRoleKey) => {
    try {
      const { data } = await axiosInstance.patch(API_ENDPOINTS.COMPANY_EMPLOYEE.CHANGE_ROLE(userNo), {
        role: newRoleKey,
      });
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || '등급 변경에 실패했습니다.';
      throw new Error(errorMessage);
    }
  },
  //심리상태
  getneedsConsult: async (companyNo) => {
    try {
      const { data } = await axiosInstance.get(API_ENDPOINTS.COMPANY_EMPLOYEE.NEEDS_CONSULT(companyNo));
      return data;
    } catch (error) {
      const message = error.response?.data?.message || '직원 리스트 불러오기 실패';
      throw new Error(message);
    }
  },
  //직원승인여부리스트
  getEmployeeApprove: async (companyNo) => {
    try {
      const { data } = await axiosInstance.get(API_ENDPOINTS.COMPANY_EMPLOYEE.APPROVEEMPLOYEE(companyNo));
      return data;
    } catch (error) {
      const message = error.response?.data?.message || '직원 리스트 불러오기 실패';
      throw new Error(message);
    }
  },

  UpdateApproveCheck: async (userNo, status) => {
    try {
      const { data } = await axiosInstance.patch(API_ENDPOINTS.COMPANY_EMPLOYEE.APPROVECHECK(userNo), { status });
      return data;
    } catch (error) {
      const message = error.response?.data?.message || '직원 승인 및 거부에 실패했습니다.';
      throw new Error(message);
    }
  },

  getEmployeeCount: async (companyNo) => {
    try {
      const { data } = await axiosInstance.get(API_ENDPOINTS.COMPANY_EMPLOYEE.EMPLOYEECOUNT(companyNo));
      return data;
    } catch (error) {
      const message = error.response?.data?.message || '직원수를 불러오는데 실패했습니다.';
      throw new Error(message);
    }
  },

  getWorcationApplies: async (companyNo) => {
    try {
      const { data } = await axiosInstance.get(API_ENDPOINTS.COMPANY_EMPLOYEE.WORCATIONAPPLIES(companyNo));
      return data;
    } catch (error) {
      const message = error.response?.data?.message || '직원을 불러오는데 실패했습니다.';
      throw new Error(message);
    }
  },
};
