import { create } from 'zustand';

export const useAiStore = create((set) => ({
  aiWorcations: [],
  aiLoading: false,
  fetchAiWorcations: async (userNo, worcationService) => {
    set({ aiLoading: true });
    const aiRes = await worcationService.getGPT(userNo);
    const recommendations = aiRes && Array.isArray(aiRes.recommendations) ? aiRes.recommendations : [];
    const worcationNos = recommendations.map((r) => r.worcation_no).filter(Boolean);
    if (worcationNos.length === 0) {
      set({ aiWorcations: [], aiLoading: false });
      return;
    }
    const ids = worcationNos.join(',');
    const aiData = await worcationService.getAI(ids, { timeout: 1000000 });
    set({ aiWorcations: Array.isArray(aiData) ? aiData : aiData ? [aiData] : [], aiLoading: false });
  },
}));
