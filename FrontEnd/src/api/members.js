import axiosInstance from './axios';
import { API_ENDPOINTS } from './config';

//로그인
const memberService = {
  login: async ({ userId, userPwd }) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
        user_id: userId,
        user_pwd: userPwd,
      });

      if (!response?.data?.token) {
        throw new Error('로그인에 실패했습니다.');
      }

      return response.data;
    } catch (error) {
      throw error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    }
  },
  init: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.MEMBER.INIT);
      return response.data;
    } catch (error) {
      console.log('error', error);
      throw error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    }
  },

  //회원가입
  register: async (formData1, formData2, formData3) => {
    const { userPwdCheck: _, ...sendData1 } = formData1;
    const sendData2 = { ...formData2 };
    const sendData3 = { ...formData3 };
    const role = formData1.role;

    // MemberDto 객체 구성
    const memberJoinDto = {
      user_id: sendData1.user_id,
      user_pwd: sendData1.user_pwd,
      name: sendData1.name,
      gender: sendData1.gender,
      role: sendData1.role,
      address: sendData1.address,
      birthday: sendData1.birthday,
      email: sendData1.email,
      phone: sendData1.phone,
    };

    // role에 따라 다른 객체 구성
    let payload;
    if (role === 'EMPLOYEE') {
      const companyProfileJoinDto = {
        company_no: sendData2.company_no,
        department_name: sendData2.department_name,
        position: sendData2.position_name,
        company_email: sendData2.company_email,
        company_phone: sendData2.company_phone,
      };

      payload = {
        member_join_dto: memberJoinDto,
        company_profile_join_dto: companyProfileJoinDto,
      };
    } else if (role === 'MASTER') {
      const companyJoinDto = {
        company_name: sendData2.company_name,
        company_address: sendData2.company_address,
        business_id: sendData2.business_id,
        business_email: sendData2.business_email,
        licensee: sendData2.licensee,
        departments: sendData2.departments,
        company_tel: sendData2.company_tel,
        open_date: sendData2.open_date,
      };

      // 3단계에서 입력한 마스터 프로필 정보 추가
      const masterProfileJoinDto = {
        department_name: sendData3.department_name,
        position: sendData3.position_name,
        company_email: sendData3.company_email,
        company_phone: sendData3.company_phone,
      };

      payload = {
        member_join_dto: memberJoinDto,
        company_join_dto: companyJoinDto,
        master_profile_join_dto: masterProfileJoinDto,
      };
    } else if (role === 'WORCATION') {
      payload = {
        member_join_dto: memberJoinDto,
      };
    }

    try {
      const { data: result } = await axiosInstance.post(API_ENDPOINTS.MEMBER.SIGNUP(role), payload);
      return result;
    } catch (error) {
      throw error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    }
  },

  // 회사명 검색
  searchCompany: async (company_name) => {
    try {
      const { data } = await axiosInstance.get(API_ENDPOINTS.COMPANY.SEARCH(company_name));
      return data;
    } catch (error) {
      throw error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    }
  },

  searchDepartment: async (company_no) => {
    try {
      const { data } = await axiosInstance.get(API_ENDPOINTS.COMPANY.DEPARTMENT_SEARCH(company_no));
      return data;
    } catch (error) {
      throw error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    }
  },

  // 내 정보 조회 (JWT 토큰 사용)
  getMyInfo: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.MEMBER.MY_INFO);
      return response.data;
    } catch (error) {
      throw error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    }
  },

  getDetail: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.MEMBER.BASE);
      return response.data;
    } catch (error) {
      throw error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    }
  },

  // 회원 정보 수정
  updateMember: async (updateData) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.MEMBER.BASE, updateData);
      return response.data;
    } catch (error) {
      throw error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    }
  },

  // 현재 비밀번호 검증
  validateCurrentPassword: async (currentPassword) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.MEMBER.VALIDATE_PASSWORD, {
        password: currentPassword,
      });
      return response.data;
    } catch (error) {
      throw error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    }
  },
  delete: async () => {
    try {
      await axiosInstance.delete(API_ENDPOINTS.MEMBER.BASE);
    } catch (error) {
      throw error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    }
  },

  sendEmailCode: async (email) => {
    try {
      await axiosInstance.post(API_ENDPOINTS.MEMBER.SEND_CODE, {
        email: email,
      });
    } catch (error) {
      throw error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    }
  },

  verifyEmailCode: async (email, code) => {
    try {
      await axiosInstance.post(API_ENDPOINTS.MEMBER.VERIFY_CODE, {
        email: email,
        code: code,
      });
    } catch (error) {
      throw error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    }
  },

  getDietRecommendation: async (userNo) => {
    try {
      const { data } = await axiosInstance.post(API_ENDPOINTS.MEMBER.EAT(userNo), null, { timeout: 1000000 });
      return data;
    } catch (error) {
      throw error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
    }
  },
};
export default memberService;
