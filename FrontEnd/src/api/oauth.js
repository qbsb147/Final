import api from './axios';
const { VITE_BASE_URL } = import.meta.env;

export const oauth2Service = {
  google: () => `${VITE_BASE_URL}/oauth2/authorization/google`,
};
export default oauth2Service;
