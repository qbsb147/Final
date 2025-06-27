import axiosInstance from './axios';
import { API_ENDPOINTS } from './config';

//로그인
const memberService = {
  login: async ({ userId, userPwd }) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
      user_id: userId,
      user_pwd: userPwd,
    });

    if (data.length === 0) throw new Error('존재하지 않는 아이디입니다.');

    const member = data[0];

    if (member.userPwd !== userPwd) throw new Error('비밀번호가 틀렸습니다.');
    return member;
  },

  //회원가입
  register: async (formData1, formData2) => {
    const { userPwdCheck: _, ...sendData1 } = formData1;
    const sendData2 = { ...formData2 };
    const role = formData1.role;

    let payload = {
      user_id: sendData1.user_id,
      user_pwd: sendData1.user_pwd,
      name: sendData1.name,
      gender: sendData1.gender,
      role: sendData1.role,
      address: sendData1.address,
      birthday: sendData1.birthday.split('T')[0],
      email: sendData1.email,
      phone: sendData1.phone,
    };

    if (role === 'employee') {
      payload = {
        ...payload,
        worcation_no: sendData2.worcation_no,
        department: sendData2.department,
        position: sendData2.position,
        company_email: sendData2.company_email,
        company_phone: sendData2.company_phone,
      };
    } else if (role === 'master') {
      payload = {
        ...payload,
        company_name: sendData2.company_name,
        business_id: sendData2.business_id,
        licensee: sendData2.licensee,
        open_date: sendData2.open_date.split('T')[0],
        department: sendData2.department,
        company_address: sendData2.company_address,
        business_email: sendData2.business_email,
        company_tel: sendData2.company_tel,
      };
    }

    const { data: member } = await axiosInstance.post(API_ENDPOINTS.MEMBER.SIGNUP(role), payload);
    return member;
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
