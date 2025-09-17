import { create } from 'zustand';
import memberService from '../api/members';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
const useAuthStore = create((set) => ({
  loginUser: null,

  setLoginUser: (user) => set({ loginUser: user }),
  logout: async () => {
    try {
      await memberService.logout();
    } catch (error) {
      throw new Error(error);
    }
    set({ loginUser: null });
  },
  fetchUserInfo: async () => {
    try {
      const { loginUser, setLoginUser } = useAuthStore.getState();
      if (!loginUser) {
        const user = await memberService.getMyInfo();
        console.log('loginUser =', user);
        setLoginUser(user);
      }
    } catch (error) {
      // alert('사용자 정보 조회 실패:', error);
      throw new Error(error);
    }
  },

  // 새로고침 시 자동으로 유저 정보를 불러오는 함수 (컴포넌트에서 useEffect로 호출)
  autoFetchUserInfo: async () => {
    const { loginUser, fetchUserInfo } = useAuthStore.getState();
    const token = getCookie('token');
    if (!loginUser && token) {
      await fetchUserInfo();
    }
  },
}));
export default useAuthStore;
