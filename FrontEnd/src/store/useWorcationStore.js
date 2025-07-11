// store/useWorcationStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWorcationStore = create(
  persist(
    (set, get) => ({
      reset: () =>
        set({
          application: {
            worcation_name: '',
            worcation_category: '',
            licensee: '',
            business_id: '',
            open_date: '',
          },
          info: {
            theme: '',
            maxPeople: '',
            partnerPrice: '',
            nonPartnerPrice: '',
            phone: '',
          },
          description: {
            detailIntro: '',
          },
          photos: {
            thumbnail: '',
            officePhotos: [],
            stayPhotos: [],
          },
          location: {
            address: '',
            locationDescription: '',
          },
          policy: {
            policyGuide: '',
            refundPolicy: '',
          },
          feature: {
            locationType: '',
            dominantColor: '',
            spaceMood: '',
            bestFor: '',
            activities: [],
            accommodationType: '',
          },
          amenities: [],
        }),
      // 1. 신청 정보
      application: {
        business_id: '',
        worcation_name: '',
        licensee: '',
        isVerified: false,
        open_date: '',
        worcation_category: '',
      },
      setApplication: (data) => set((state) => ({ application: { ...state.application, ...data } })),
      // 2. 기본 정보
      info: {
        phone: '',
        category: '',
        theme: '',
      },
      setInfo: (data) => {
        const sanitized = {
          ...data,
          category: data.category === '' ? '' : data.category,
        };
        set((state) => ({ info: { ...state.info, ...sanitized } }));
      },

      // 3. 설명/소개
      description: {
        detailIntro: '',
      },
      setDescription: (data) => set((state) => ({ description: { ...state.description, ...data } })),

      // 4. 사진
      photos: {
        thumbnail: '', // 섬네일 이미지
        officePhotos: [],
        stayPhotos: [],
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
        checkinPeriod: '',
        checkinHour: '',
        checkinMinute: '',
        checkoutPeriod: '',
        checkoutHour: '',
        checkoutMinute: '',
        officeStartPeriod: '',
        officeStartHour: '',
        officeStartMinute: '',
        officeEndPeriod: '',
        officeEndHour: '',
        officeEndMinute: '',
        policyGuide: '',
      },
      setPolicy: (data) => set((state) => ({ policy: { ...state.policy, ...data } })),

      // 8. 특징
      feature: {
        locationType: '',
        dominantColor: '',
        spaceMood: '',
        bestFor: '',
        activities: [],
        accommodationType: '',
      },
      setFeature: (data) => set((state) => ({ feature: { ...state.feature, ...data } })),

      //상태 (임시저장/등록 여부)
      status: 'N', // 기본값은 'N' (임시저장 상태)
      setStatus: (newStatus) => set(() => ({ status: newStatus })),

      //가격
      price: {
        partnerPrice: '',
        nonPartnerPrice: '',
      },
      setPrice: (data) =>
        set((state) => ({
          price: { ...state.price, ...data },
        })),

      // 유효성 검사
      isNonNull: () => {
        const { application, info, location } = get();
        return application.companyNo && info.worcationName && info.category && location.address;
      },
      isValidate: () => {
        const { info } = get();
        return info.worcationName.length >= 2;
      },
    }),
    {
      name: 'worcation-store', // localStorage key 이름
      getStorage: () => localStorage, // localStorage에 저장
    }
  )
);

export default useWorcationStore;
