import { create } from 'zustand';

const useBusinessStore = create((set) => ({
  formData: {
    businessId: '',
    licensee: '',
    worcationName: '',
    openDate: '',
    category: '',
    address: '',
    tel: '',
    email: '',
    description: '',
    amenities: [],
    features: [],
    photos: [],
    website: '',
  },

  setFormData: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        ...data,
      },
    })),

  updateField: (field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
    })),

  resetFormData: () =>
    set(() => ({
      formData: {
        businessId: '',
        licensee: '',
        worcationName: '',
        openDate: '',
        category: '',
        address: '',
        tel: '',
        email: '',
        description: '',
        amenities: [],
        features: [],
        photos: [],
        website: '',
      },
    })),
}));

export default useBusinessStore;
