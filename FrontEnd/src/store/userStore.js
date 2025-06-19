import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: {
    user_no: 1,
    user_id: 'qwer1234',
    name: '최예찬',
    email: 'qbsb147',
    gender: 'M',
    birthday: '1996-09-20',
    address: '서울특별시 은평구',
    phone: '010-6640-8235',
    role: 'manager',
    create_at: '2015-07-30',
    update_at: '2020-08-25',
  },
  isAuthenticated: true,

  login: () => {
    set({
      user: {},
      isAuthenticated: true,
    });
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));

export default useUserStore;
