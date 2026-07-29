import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  enhanceProfessionalSummary,
  enhanceJobDescription,
  uploadResume,
  enhanceSection,
  analyzeATS,
} from "../controllers/resumeAiController.js";

const router = express.Router();

router.post("/enhance-pro-sum", protectRoute, enhanceProfessionalSummary);
router.post("/enhance-job-desc", protectRoute, enhanceJobDescription);
router.post("/upload-resume", protectRoute, uploadResume);
router.post("/enhance-section", protectRoute, enhanceSection);
router.post("/ats-analyze", protectRoute, analyzeATS);

export default router;
