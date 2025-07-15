import { create } from 'zustand';
import { mentalService } from '../api/mentals';

const useUserStore = create((set) => ({
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
    try {
      // const tendency = await memberPreferenceService.postTendency({
      //   tendency: answers,
      //   user_no: user_no,
      // });

      navigate('/trial');
    } catch (error) {
      console.error('제출 에러 : ', error);
    }
  },
}));

export default useUserStore;
