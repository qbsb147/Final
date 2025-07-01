import axios from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Swal from 'sweetalert2';
import { isValid } from 'date-fns';

const useWorcationStore = create((set, get) => ({
  isValidate: true,
  setIsValidate: (value) => set({ isValidate: value }),
  isNonNull: false,
  setIsNonNull: (value) => set({ isValidate: value }),
}));

const useHostStore = create((set) => ({
  hostForm: {},
  setHostForm: (form) => set({ hostForm: form }),
}));

const checkBusiness = async () => {
  const formData = getValues(); // react-hook-form에서 현재 값 가져오기
  console.log('API 키:', import.meta.env.VITE_ODCLOUD_SERVICE_KEY);

  if (!formData.business_id || formData.business_id.length !== 10) {
    alert('사업자등록번호를 10자리로 정확히 입력해주세요.');
    return;
  }

  const businessData = {
    businesses: [
      {
        b_no: formData.business_id,
        start_dt: formData.start_dt,
        p_nm: formData.licensee || '',
        p_nm2: formData.licensee || '',
        b_nm: formData.worcation_name || '',
        corp_no: '',
        b_sector: '',
        b_type: '',
        b_adr: '',
      },
    ],
  };

  try {
    const serviceKey = import.meta.env.VITE_ODCLOUD_SERVICE_KEY;
    const url = `https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=${serviceKey}`;

    const response = await axios.post(url, businessData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('최종 요청 URL:', url);

    const result = response?.data?.data?.[0];

    if (result?.b_stt_cd === '01') {
      // 정상 사업자인 경우
      useHostStore.getState().setHostForm({ ...formData, type: selected });
      alert('사업자 등록번호 확인되었습니다.');
    } else {
      alert('유효하지 않은 사업자 등록번호입니다.');
    }
  } catch (error) {
    console.error('사업자 진위확인 실패:', error);
    alert('오류가 발생했습니다. 다시 시도해주세요.');
  }
};

export default useWorcationStore;
