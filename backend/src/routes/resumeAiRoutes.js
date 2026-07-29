import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  enhanceProfessionalSummary,
  enhanceJobDescription,
  uploadResume,
  enhanceSection,
  analyzeATS,
  getUserATSReports,
  deleteATSReport,
} from "../controllers/resumeAiController.js";

const router = express.Router();

router.post("/enhance-pro-sum", protectRoute, enhanceProfessionalSummary);
router.post("/enhance-job-desc", protectRoute, enhanceJobDescription);
router.post("/upload-resume", protectRoute, uploadResume);
router.post("/enhance-section", protectRoute, enhanceSection);
router.post("/ats-analyze", protectRoute, analyzeATS);
router.get("/ats-reports", protectRoute, getUserATSReports);
router.delete("/ats-reports/:reportId", protectRoute, deleteATSReport);

export default router;
