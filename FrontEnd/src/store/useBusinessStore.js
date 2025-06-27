import { create } from 'zustand';

const useBusinessStore = create((set) => ({
  formData: {
    businessId: '',
    licensee: '',
    worcationName: '',
    openDate: '',
    category: '',
  },
  setFormData: (data) => set({ formData: { ...data } }),
  updateField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),
}));
export default useBusinessStore;
