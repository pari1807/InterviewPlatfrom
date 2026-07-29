import apiClient from "./apiClient";

export const resumeApi = {
  // Fetch all resumes for logged in user
  getAllResumes: async () => {
    const response = await apiClient.get("/resumes/my-resumes");
    return response.data;
  },

  // Get a single resume by ID
  getResumeById: async (resumeId) => {
    const response = await apiClient.get(`/resumes/detail/${resumeId}`);
    return response.data;
  },

  // Get public resume by ID
  getPublicResumeById: async (resumeId) => {
    const response = await apiClient.get(`/resumes/public/${resumeId}`);
    return response.data;
  },

  // Create new resume
  createResume: async (resumeData) => {
    const response = await apiClient.post("/resumes/create", resumeData);
    return response.data;
  },

  // Update existing resume
  updateResume: async (formData) => {
    const response = await apiClient.put("/resumes/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Delete resume
  deleteResume: async (resumeId) => {
    const response = await apiClient.delete(`/resumes/${resumeId}`);
    return response.data;
  },

  // AI Enhancements
  enhanceSummary: async (userContent) => {
    const response = await apiClient.post("/resume-ai/enhance-pro-sum", { userContent });
    return response.data;
  },

  enhanceJobDesc: async (userContent) => {
    const response = await apiClient.post("/resume-ai/enhance-job-desc", { userContent });
    return response.data;
  },

  enhanceSection: async (section, userContent) => {
    const response = await apiClient.post("/resume-ai/enhance-section", { section, userContent });
    return response.data;
  },

  uploadResumeText: async (resumeText, title) => {
    const response = await apiClient.post("/resume-ai/upload-resume", { resumeText, title });
    return response.data;
  },
};
