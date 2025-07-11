// store/useWorcationStore.js
import { create } from 'zustand';

const initialState = {
  // 1. 신청 정보
  application: {
    companyNo: '',
    businessName: '',
    ownerName: '',
    tel: '',
    worcation_name: '',
    companyType: '',
    business_id: '',
    licensee: '',
    open_date: '',
  },
  // 2. 기본 정보
  info: {
    category: '',
    intro: '',
  },
  // 3. 설명/소개
  description: {
    detailIntro: '',
  },
  // 4. 사진
  photos: {
    officePhotos: [],
    stayPhotos: [],
  },
  // 5. 편의시설
  amenities: [],
  // 6. 위치
  location: {
    address: '',
    locationDescription: '',
  },
  // 7. 정책
  policy: {
    refundPolicy: '',
    notice: '',
    checkinPeriod: 'AM',
    checkinHour: '9',
    checkinMinute: '00',
    checkoutPeriod: 'AM',
    checkoutHour: '11',
    checkoutMinute: '00',
    officeStartPeriod: 'AM',
    officeStartHour: '9',
    officeStartMinute: '00',
    officeEndPeriod: 'PM',
    officeEndHour: '6',
    officeEndMinute: '00',
    policyGuide: '',
  },
  // 8. 특징
  feature: {
    locationType: '',
    dominantColor: '',
    spaceMood: '',
    bestFor: '',
    activities: [],
    accommodationType: '',
  },
};

const useWorcationStore = create((set, get) => ({
  ...initialState,

  // 각 섹션별 setter
  setApplication: (data) => set((state) => ({ application: { ...state.application, ...data } })),
  setInfo: (data) => set((state) => ({ info: { ...state.info, ...data } })),
  setDescription: (data) => set((state) => ({ description: { ...state.description, ...data } })),
  setPhotos: (data) => set((state) => ({ photos: { ...state.photos, ...data } })),
  setAmenities: (data) => set(() => ({ amenities: data })),
  setLocation: (data) => set((state) => ({ location: { ...state.location, ...data } })),
  setPolicy: (data) => set((state) => ({ policy: { ...state.policy, ...data } })),
  setFeature: (data) => set((state) => ({ feature: { ...state.feature, ...data } })),

  // 전체 초기화
  resetAll: () => set(initialState),

  // 데이터 한 번에 설정 (수정 시 사용)
  setAllData: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),

  // 유효성 검사 예시
  isNonNull: () => {
    const { application, info, location } = get();
    return !!application.companyNo && !!info.worcationName && !!info.category && !!location.address;
  },
  isValidate: () => {
    const { info } = get();
    return info.worcationName.length >= 2; // 예시
  },

  // 모든 데이터 한 번에 반환
  getAll: () => {
    const state = get();
    return {
      application: state.application,
      info: state.info,
      description: state.description,
      photos: state.photos,
      amenities: state.amenities,
      location: state.location,
      policy: state.policy,
      feature: state.feature,
    };
  },
}));

export default useWorcationStore;
