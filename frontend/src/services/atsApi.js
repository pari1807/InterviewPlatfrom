import apiClient from "./apiClient";

export const atsApi = {
  analyzeATS: async ({ resumeId, resumeContent, jobTitle, jobDescription }) => {
    const response = await apiClient.post("/resume-ai/ats-analyze", {
      resumeId,
      resumeContent,
      jobTitle,
      jobDescription,
    });
    return response.data;
  },
};
