import { create } from 'zustand';

export const useAiStore = create((set) => ({
  aiWorcations: [],
  aiLoading: false,
  fetchAiWorcations: async (userNo, worcationService) => {
    set({ aiLoading: true });
    const aiRes = await worcationService.getGPT(userNo);
    const recommendations = aiRes && Array.isArray(aiRes.recommendations) ? aiRes.recommendations : [];
    const worcationNos = recommendations.map((r) => r.worcation_no || r.wocation_no || r.woration_no).filter(Boolean);
    const ids = worcationNos.join(',');

    if (!ids || ids.length === 0) {
      set({ aiWorcations: [], aiLoading: false });
      return;
    }

    const aiData = await worcationService.getAI(ids);
    set({ aiWorcations: Array.isArray(aiData) ? aiData : aiData ? [aiData] : [], aiLoading: false });
  },
}));
