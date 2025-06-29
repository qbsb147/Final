import axiosInstance from './axios';
import { API_ENDPOINTS } from './config';

//로그인
const memberService = {
  login: async ({ userId, userPwd }) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
      user_id: userId,
      user_pwd: userPwd,
    });

    // 서버에서 JWT 토큰을 포함한 응답을 보내므로 data 구조가 다름
    // data.token 형태로 응답이 올 것으로 예상
    if (!data || !data.token) {
      throw new Error('로그인에 실패했습니다.');
    }

    return data;
  },

  //회원가입
  register: async (formData1, formData2) => {
    const { userPwdCheck: _, ...sendData1 } = formData1;
    const sendData2 = { ...formData2 };
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
    if (role === 'employee') {
      const companyProfileJoinDto = {
        company_no: sendData2.company_no,
        department_name: sendData2.department_name,
        position: sendData2.position_name,
        company_email: sendData2.company_email,
        company_phone: sendData2.company_phone,
      };

      payload = {
        memberJoinDto: memberJoinDto,
        companyProfileJoinDto: companyProfileJoinDto,
      };
    } else if (role === 'master') {
      const companyJoinDto = {
        company_name: sendData2.company_name,
        company_address: sendData2.company_address,
        business_id: sendData2.business_id,
        business_email: sendData2.business_email,
        licensee: sendData2.licensee,
        department_name: sendData2.department_name,
        company_tel: sendData2.company_tel,
        open_date: sendData2.open_date,
      };

      payload = {
        memberJoinDto: memberJoinDto,
        companyJoinDto: companyJoinDto,
      };
    } else if (role === 'worcation') {
      payload = {
        memberJoinDto: memberJoinDto,
      };
    }
    console.log('payload', payload);

    const { data: result } = await axiosInstance.post(API_ENDPOINTS.MEMBER.SIGNUP(role), payload);
    return result;
  },

  // 회사명 검색
  searchCompany: async (company_name) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.COMPANY.SEARCH(company_name));
    return data;
  },

  searchDepartment: async (company_no) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.COMPANY.DEPARTMENT_SEARCH(company_no));
    return data;
  },
};
export default memberService;
