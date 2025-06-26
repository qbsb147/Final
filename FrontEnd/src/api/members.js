import axiosInstance from './axios';
import { API_ENDPOINTS } from './config';

//로그인
const memberService = {
  login: async ({ userId, userPwd }) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.USERS.BASE, {
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
    const role = formData1.type;

    // 회원 유형별로 맞는 엔드포인트로 회원가입 요청
    const { data: member } = await axiosInstance.post(API_ENDPOINTS.MEMBER.SIGNUP(role), {
      // formData1
      user_id: sendData1.user_id,
      user_pwd: sendData1.user_pwd,
      name: sendData1.name,
      gender: sendData1.gender,
      type: sendData1.type,
      address: sendData1.address,
      birthday: sendData1.birthday,
      email: sendData1.email,
      phone: sendData1.phone,
      // formData2 (typeA: employee, typeB: master)
      company_name: sendData2.company_name,
      department: sendData2.department,
      position: sendData2.position,
      company_address: sendData2.company_address,
      company_email: sendData2.company_email,
      company_phone: sendData2.company_phone,
      // typeB only
      business_id: sendData2.business_id,
      licensee: sendData2.licensee,
      open_date: sendData2.open_date,
      business_email: sendData2.business_email,
      company_tel: sendData2.company_tel,
    });
    return member;
  },

  // 회사명 검색
  searchCompany: async (companyName) => {
    const { data } = await axiosInstance.get(`/company/search`, {
      params: { company_name: companyName },
    });
    return data;
  },
};
export default memberService;
