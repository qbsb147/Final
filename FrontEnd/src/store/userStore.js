import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      body: null,
      stress: null,
      burnout: null,
      tendency: null,
      eats: [],
      eatsDate: null,
      setEats: (newEats, date) => set({ eats: newEats, eatsDate: date }),
    }),
    {
      name: 'user-eats-storage',
      partialize: (state) => ({
        eats: state.eats,
        eatsDate: state.eatsDate,
      }),
    }
  )
);

export default useUserStore;
