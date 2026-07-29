import { create } from "zustand";

export const useResumeStore = create((set) => ({
  resumes: [],
  addResume: (resume) =>
    set((state) => {
      const updated = [resume, ...state.resumes];
      if (typeof window !== "undefined") {
        localStorage.setItem("matchrate_resumes", JSON.stringify(updated));
      }
      return { resumes: updated };
    }),
  setResumes: (resumes) => set({ resumes }),
}));
