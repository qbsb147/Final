import { create } from 'zustand';
import axios from 'axios';

const useWorcationStore = create((set, get) => ({
  //zustand에서 상태관리를 위한 store 생성, set 상태 업데이트, get 현재 값 가져옴
  selectedWorcation: null,
  selectedDetail: null,
  worcations: [], //전체 워케이션
  partners: [], //제휴 업체
  reviews: [], //리뷰
  isLoading: false, //로딩 여부

  fetchWorcations: async () => {
    //워케이션 전체 데이터를 API로부터 불러오고 worcations에 저장합니다.
    set({ isLoading: true }); //호출 전에는 isLoading을 true로 설정하고, 완료되면 다시 false로 돌립니다.
    try {
      const res = await axios.get('http://localhost:3001/worcation');
      set({ worcations: res.data });
    } catch (error) {
      console.error('worcation fetch error:', error);
      alert('워케이션 데이터를 불러오는 데 실패했습니다.');
    } finally {
      set({ isLoading: false });
    }
  },

  //worcation_partner API에서 데이터를 받아오고, approve === 'Y'인 제휴 승인된 데이터만 partners에 저장합니다.
  fetchPartners: async () => {
    try {
      const res = await axios.get('http://localhost:3001/worcation_partner');
      const approved = res.data.filter((p) => p.approve === 'Y');
      set({ partners: approved });
    } catch (error) {
      console.error('partner fetch error:', error);
      alert('제휴 업체 데이터를 불러오는 데 실패했습니다.');
    }
  },

  //리뷰 데이터를 불러와 reviews 상태에 저장합니다.
  fetchReviews: async () => {
    try {
      const res = await axios.get('http://localhost:3001/review');
      set({ reviews: res.data });
    } catch (error) {
      console.error('review fetch error:', error);
      alert('리뷰 데이터를 불러오는 데 실패했습니다.');
    }
  },

  //특정 회사(company)의 company_no를 기준으로 제휴 업체만 필터링해서 반환합니다.
  getFilteredPartnersByCompany: (companyNo) => {
    const partners = get().partners;
    return partners.filter((p) => p.company_no === companyNo);
  },

  //워케이션, 제휴업체, 리뷰 데이터를 한 번에 병렬 요청합니다.
  //페이지 초기 진입 시 데이터 로딩 용도로 호출됩니다.
  initWorcationData: async () => {
    await Promise.all([get().fetchWorcations(), get().fetchPartners(), get().fetchReviews()]);
  },

  fetchWorcationDetail: async (worcationNo) => {
    try {
      const [worcationRes, detailRes, reviewsRes, featuresRes, photoRes, amenityMapRes, allAmenityRes] =
        await Promise.all([
          axios.get(`http://localhost:3001/worcation?worcation_no=${worcationNo}`),
          axios.get(`http://localhost:3001/worcation_detail?worcation_no=${worcationNo}`),
          axios.get(`http://localhost:3001/review?application_no=${worcationNo}`),
          axios.get(`http://localhost:3001/worcation_features?worcation_no=${worcationNo}`),
          axios.get(`http://localhost:3001/photo?worcation_no=${worcationNo}`),
          axios.get(`http://localhost:3001/worcation_amenity?worcation_no=${worcationNo}`),
          axios.get(`http://localhost:3001/amenity`),
        ]);

      const amenityNos = amenityMapRes.data.map((a) => a.amenity_no);
      const matchedAmenities = allAmenityRes.data.filter((am) => amenityNos.includes(am.amenity_no));

      set({
        selectedWorcation: worcationRes.data[0],
        selectedDetail: detailRes.data[0],
        selectedReviews: reviewsRes.data,
        selectedFeatures: featuresRes.data,
        selectedPhotos: photoRes.data,
        selectedAmenities: matchedAmenities,
      });
    } catch (error) {
      console.error('fetchWorcationDetail error:', error);
    }
  },
  addReview: async (review) => {
    await axios.post('http://localhost:3001/review', review);
    set((state) => ({
      selectedReviews: [...state.selectedReviews, review],
    }));
  },

  updateReview: async (reviewNo, content) => {
    const update_at = new Date().toISOString();
    await axios.patch(`http://localhost:3001/review/${reviewNo}`, {
      review_content: content,
      update_at,
    });
    set((state) => ({
      selectedReviews: state.selectedReviews.map((r) =>
        r.review_no === reviewNo ? { ...r, review_content: content, update_at } : r
      ),
    }));
  },

  deleteReview: async (reviewNo) => {
    await axios.delete(`http://localhost:3001/review/${reviewNo}`);
    set((state) => ({
      selectedReviews: state.selectedReviews.filter((r) => r.review_no !== reviewNo),
    }));
  },
}));

//이 store를 다른 컴포넌트에서 import하여 사용할 수 있게 합니다.
export default useWorcationStore;
