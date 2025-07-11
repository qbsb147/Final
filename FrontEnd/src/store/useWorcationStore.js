// store/useWorcationStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWorcationStore = create(
  persist(
    (set, get) => ({
      reset: () =>
        set({
          application: {
            worcation_name: null,
            worcation_category: 'Office',
            licensee: null,
            business_id: null,
            open_date: null,
          },
          info: {
            theme: null,
            maxPeople: null,
            partnerPrice: null,
            nonPartnerPrice: null,
            phone: null,
          },
          description: {
            detailIntro: null,
          },
          photos: {
            thumbnail: null,
            officePhotos: [],
            stayPhotos: [],
          },
          location: {
            address: null,
            locationDescription: null,
          },
          policy: {
            policyGuide: null,
            refundPolicy: null,
          },
          feature: {
            locationType: null,
            dominantColor: null,
            spaceMood: null,
            bestFor: null,
            activities: [],
            accommodationType: null,
          },
          amenities: [],
        }),
      // 1. 신청 정보
      application: {
        business_id: null,
        worcation_name: null,
        licensee: null,
        isVerified: false,
        open_date: null,
        worcation_category: 'Office',
      },
      setApplication: (data) => set((state) => ({ application: { ...state.application, ...data } })),
      // 2. 기본 정보
      info: {
        phone: null,
        category: null,
        theme: null,
      },
      setInfo: (data) => {
        const sanitized = {
          ...data,
          category: data.category === null ? null : data.category,
        };
        set((state) => ({ info: { ...state.info, ...sanitized } }));
      },

      // 3. 설명/소개
      description: {
        detailIntro: null,
      },
      setDescription: (data) => set((state) => ({ description: { ...state.description, ...data } })),

      // 4. 사진
      photos: {
        thumbnail: null, // 섬네일 이미지
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
      //   address: null,
      //   lat: null,
      //   lng: null,
      // },
      // setLocation: (data) => set((state) => ({ location: { ...state.location, ...data } })),

      location: {
        address: null,
        locationDescription: null,
      },
      setLocation: (newLocation) => set({ location: newLocation }),
      // 7. 정책
      // policy: {
      //   refundPolicy: '',
      //   notice: '',
      // },
      // setPolicy: (data) => set((state) => ({ policy: { ...state.policy, ...data } })),

      policy: {
        refundPolicy: null,
        notice: null,
        checkinPeriod: null,
        checkinHour: null,
        checkinMinute: null,
        checkoutPeriod: null,
        checkoutHour: null,
        checkoutMinute: null,
        officeStartPeriod: null,
        officeStartHour: null,
        officeStartMinute: null,
        officeEndPeriod: null,
        officeEndHour: null,
        officeEndMinute: null,
        policyGuide: null,
      },
      setPolicy: (data) => set((state) => ({ policy: { ...state.policy, ...data } })),

      // 8. 특징
      feature: {
        locationType: null,
        dominantColor: null,
        spaceMood: null,
        bestFor: null,
        activities: [],
        accommodationType: null,
      },
      setFeature: (data) => set((state) => ({ feature: { ...state.feature, ...data } })),

      //상태 (임시저장/등록 여부)
      status: 'N', // 기본값은 'N' (임시저장 상태)
      setStatus: (newStatus) => set(() => ({ status: newStatus })),

      //가격
      price: {
        partnerPrice: null,
        nonPartnerPrice: null,
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
