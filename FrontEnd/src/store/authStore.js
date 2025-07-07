import { create } from 'zustand';
import memberService from '../api/members';

const useAuthStore = create((set) => ({
  loginUser: null,

  setLoginUser: (user) => set({ loginUser: user }),
  logout: () => {
    localStorage.removeItem('token');
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
    const token = localStorage.getItem('token');
    if (!loginUser && token) {
      await fetchUserInfo();
    }
  },
}));
export default useAuthStore;
