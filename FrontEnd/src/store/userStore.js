import { create } from 'zustand';
import { mentalService } from '../api/mentals';
import { memberPreferenceService } from '../api/memberPreference';

const useUserStore = create((set) => ({
  user: {
    user_no: 1,
    user_id: 'qwer1234',
    name: '최예찬',
    email: 'qbsb147',
    gender: 'M',
    birthday: '1996-09-20',
    address: '서울특별시 은평구',
    phone: '010-6640-8235',
    role: 'manager',
    create_at: '2015-07-30',
    update_at: '2020-08-25',
  },
  body: null,
  stress: null,
  burnout: null,
  tendency: null,
  eats: [
    {
      time: 1,
      title: '추천 조식 식단',
      image: 'src/assets/meals.png ',
      menu: '귀리 오트밀 + 무가당 두유 → 토핑: 블루베리, 호두, 아몬드, 시나몬 소량 삶은 계란 1개 따뜻한 캐모마일차 or 루이보스티',
      explain: '세로토닌 분비 시작을 도와주는 아침식단 귀리 + 견과류 + 과일 조합은  천연 항우울/항스트레스 조합입니다.',
    },
    {
      time: 2,
      title: '추천 조식 식단',
      image: 'src/assets/meals.png ',
      menu: '귀리 오트밀 + 무가당 두유 → 토핑: 블루베리, 호두, 아몬드, 시나몬 소량 삶은 계란 1개 따뜻한 캐모마일차 or 루이보스티',
      explain: '세로토닌 분비 시작을 도와주는 아침식단 귀리 + 견과류 + 과일 조합은  천연 항우울/항스트레스 조합입니다.',
    },
    {
      time: 3,
      title: '추천 조식 식단',
      image: 'src/assets/meals.png ',
      menu: '귀리 오트밀 + 무가당 두유 → 토핑: 블루베리, 호두, 아몬드, 시나몬 소량 삶은 계란 1개 따뜻한 캐모마일차 or 루이보스티',
      explain: '세로토닌 분비 시작을 도와주는 아침식단 귀리 + 견과류 + 과일 조합은  천연 항우울/항스트레스 조합입니다.',
    },
  ],

  postStress: async (answers, navigate) => {
    const user_no = useUserStore.getState().user.user_no;
    try {
      const stress = await mentalService.postStress({
        stress: answers,
        user_no: user_no,
      });
      console.log('stress', stress);
      set({ stress });

      navigate('/trial');
    } catch (error) {
      console.error('제출 에러 : ', error);
    }
  },

  postBurnout: async (answers, navigate) => {
    const user_no = useUserStore.getState().user.user_no;
    try {
      const burnout = await mentalService.postBurnout({
        burnout: answers,
        user_no: user_no,
      });

      set({ burnout });

      navigate('/trial');
    } catch (error) {
      console.error('제출 에러 : ', error);
    }
  },

  postTendency: async (answers, navigate) => {
    const user_no = useUserStore.getState().user.user_no;
    try {
      const tendency = await memberPreferenceService.postTendency({
        tendency: answers,
        user_no: user_no,
      });

      set({ tendency });

      navigate('/trial');
    } catch (error) {
      console.error('제출 에러 : ', error);
    }
  },
  login: () => {
    set({
      user: {},
    });
  },
  setUser: (user) => set({ user }),
  logout: () => {
    set({
      user: null,
    });
  },
}));

export default useUserStore;
