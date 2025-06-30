import axios from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Swal from 'sweetalert2';
import { isValid } from 'date-fns';

const useWorcationStore = create((set, get) => ({
  isValidate: false,
  setIsValidate: (value) => set({ isValidate: value }),
  isNonNull: false,
  setIsNonNull: (value) => set({ isValidate: value }),
}));

const useHostStore = create((set) => ({
  hostForm: {},
  setHostForm: (form) => set({ hostForm: form }),
}));

const checkBusiness = async () => {
  const formData = getValues(); // 입력된 전체 값

  const businessData = {
    businesses: [
      {
        b_no: formData.business_id,
        start_dt: '20000101',
        p_nm: formData.licensee,
        p_nm2: formData.licensee,
        b_nm: formData.worcation_name,
        corp_no: '',
        b_sector: '',
        b_type: '',
        b_adr: '',
      },
    ],
  };

  try {
    const serviceKey =
      'bHM92CZd4eRIBau2YkOh2hG5UpF9YxODPwSDqY%2FcJIdTQHYkOiDJIjABzgFpyelodd0eFsuZIYBrLjjzuwn%2BeQ%3D%3D'; // 실제 발급받은 인증키
    const url = `https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=${encodeURIComponent(serviceKey)}`;

    const response = await axios.post(url, businessData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = response?.data?.data?.[0];

    if (result && result.b_stt_cd === '01') {
      // 정상 사업자인 경우
      useHostStore.getState().setHostForm({ ...formData, type: selected });
      alert('사업자 등록번호 확인되었습니다.');
    } else {
      alert('유효하지 않은 사업자 등록번호입니다.');
    }
  } catch (error) {
    console.error('사업자 진위확인 실패:', error);
    alert('사업자 진위확인 중 오류가 발생했습니다.');
  }
};
export default useWorcationStore;
