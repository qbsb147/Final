import api from "../axios";

//로그인
export const login = async ({userId,userPwd}) => {
    const { data } = await api.get(`/members?userId=${userId}`);

  if (data.length === 0) throw new Error('존재하지 않는 아이디입니다.');

  const member = data[0];

  if (member.userPwd !== userPwd) throw new Error('비밀번호가 틀렸습니다.');
  return member;
}