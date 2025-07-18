import { create } from 'zustand';

const useSelectedWorcationStore = create((set) => ({
  selectedWorcation: JSON.parse(localStorage.getItem('selectedWorcation') || 'null'),
  setSelectedWorcation: (worcation) => {
    localStorage.setItem('selectedWorcation', JSON.stringify(worcation));
    set({ selectedWorcation: worcation });
  },
  clearSelectedWorcation: () => {
    localStorage.removeItem('selectedWorcation');
    set({ selectedWorcation: null });
  },
}));

export default useSelectedWorcationStore; 