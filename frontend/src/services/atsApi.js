import apiClient from "./apiClient";

export const atsApi = {
  analyzeATS: async (payload) => {
    const response = await apiClient.post("/resume-ai/ats-analyze", payload);
    return response.data;
  },

  getUserReports: async () => {
    const response = await apiClient.get("/resume-ai/ats-reports");
    return response.data;
  },

  deleteReport: async (reportId) => {
    const response = await apiClient.delete(`/resume-ai/ats-reports/${reportId}`);
    return response.data;
  },
};
