import axios from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Swal from 'sweetalert2';
import { isValid } from 'date-fns';

const useWorcationStore = create((set, get) => ({
  isValidate: false,
  setIsValidate: (value) => set({ isValidate: value }),
  isNonNull: false,
  setIsNonNull: (value) => set({ isValidate: value }),
}));

export default useWorcationStore;
