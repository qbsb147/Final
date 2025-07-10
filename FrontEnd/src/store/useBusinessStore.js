import { create } from 'zustand';

const useBusinessStore = create((set) => ({
  formData: {
    businessId: '',
    licensee: '',
    worcationName: '',
    openDate: '',
    category: '',
  },
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  updateField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),
  setIsVerified: (value) => set({ isVerified: value }),
}));
export default useBusinessStore;
