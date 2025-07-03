// import axios from 'axios';
// import { persist } from 'zustand/middleware';
// import Swal from 'sweetalert2';
// import { isValid } from 'date-fns';

import { create } from 'zustand';

// const useHostStore = create((set) => ({
//   hostForm: {},
//   setHostForm: (form) => set({ hostForm: form }),
// }));

//키워드 검색
const useWorcationStore = create((set) => ({
  isValidate: false,
  setIsValidate: (value) => set({ isValidate: value }),
  isNonNull: false,
  setIsNonNull: (value) => set({ isValidate: value }),
  keyword: '',
  setKeyword: (value) => set({ keyword: value }),
  startDate: null,
  endDate: null,
  setDates: (start, end) => set({ startDate: start, endDate: end }),
  popularKeywords: [],
  setPopularKeywords: (arr) => set({ popularKeywords: arr }),
}));

export default useWorcationStore;
