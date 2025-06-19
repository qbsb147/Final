import axios from 'axios';
import { create } from 'zustand';

const eatStore = create((set, get) => ({
  body: true,
  brain: false,
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
  recommended_intake: {
    man: {
      standard: '성인 남성 기준',
      calories: '2000kcal',
      carbohydrates: '310g',
      protein: '55g',
      fat: '60g',
      sodium: '2,000mg 이하',
    },
    woman: {
      standard: '성인 여성 기준',
      calories: '1800kcal',
      carbohydrates: '280g',
      protein: '50g',
      fat: '50g',
      sodium: '2,000mg 이하',
    },
  },
}));

export default eatStore;
