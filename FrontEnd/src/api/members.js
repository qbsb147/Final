import api from 'axios';
import { API_ENDPOINTS } from './config';

//로그인
const memberService = {
  login: async ({ userId, userPwd }) => {
    const { data } = await api.post(API_ENDPOINTS.USERS.BASE, {
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

    //1. 공통 : 회원 정보 등록
    const { data: member } = await api.post('/members', sendData1);

    //2. 유형별 추가 관리

    switch (formData1.type) {
      //직원
      case 'employee': {
        await api.post('/companyProfiles', {
          ...sendData2,
          memberNo: member.memberNo,
        });
        break;
      }
      //기업
      case 'master': {
        await api.post('/companyProfiles', {
          ...sendData2,
          memberNo: member.memberNo,
        });
        break;
      }
      //워케이션
      case 'worcation': {
        break;
      }
      default:
        throw new Error('유효하지 않은 회원 유형입니다.');
    }
    return member;
  },
};
export default memberService;
