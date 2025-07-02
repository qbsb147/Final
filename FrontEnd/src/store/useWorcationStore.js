// store/useWorcationStore.js
import { create } from 'zustand';

const useWorcationStore = create((set, get) => ({
  // 1. 신청 정보
  application: {
    companyNo: null,
    businessNo: '',
    businessName: '',
    ownerName: '',
    tel: '',
  },
  setApplication: (data) => set((state) => ({ application: { ...state.application, ...data } })),

  // 2. 기본 정보
  info: {
    worcationName: '',
    category: '',
    intro: '',
  },
  setInfo: (data) => set((state) => ({ info: { ...state.info, ...data } })),

  // 3. 설명/소개
  description: {
    detailIntro: '',
  },
  setDescription: (data) => set((state) => ({ description: { ...state.description, ...data } })),

  // 4. 사진
  photos: {
    thumbnail: null,
    detailImages: [],
  },
  setPhotos: (data) => set((state) => ({ photos: { ...state.photos, ...data } })),

  // 5. 편의시설
  amenities: [],
  setAmenities: (data) => set(() => ({ amenities: data })),

  // 6. 위치
  // location: {
  //   address: '',
  //   lat: null,
  //   lng: null,
  // },
  // setLocation: (data) => set((state) => ({ location: { ...state.location, ...data } })),

  location: {
    address: '',
    locationDescription: '',
  },
  setLocation: (newLocation) => set({ location: newLocation }),
  // 7. 정책
  // policy: {
  //   refundPolicy: '',
  //   notice: '',
  // },
  // setPolicy: (data) => set((state) => ({ policy: { ...state.policy, ...data } })),

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
  setPolicy: (data) => set((state) => ({ policy: { ...state.policy, ...data } })),

  // 8. 특징
  features: [],
  setFeatures: (data) => set(() => ({ features: data })),

  // 유효성 검사
  isNonNull: () => {
    const { application, info, location } = get();
    return application.companyNo && info.worcationName && info.category && location.address;
  },

  isValidate: () => {
    const { info } = get();
    return info.worcationName.length >= 2; // 예시
  },
}));

export default useWorcationStore;
