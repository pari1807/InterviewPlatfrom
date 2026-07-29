import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  handleAnalyzeCode,
  handleExpandRubric,
  handleGenerateFeedback,
  handleMonitorLive,
  getEvaluationBySession,
} from "../controllers/aiController.js";

const router = express.Router();

router.post("/analyze-code", protectRoute, handleAnalyzeCode);
router.post("/expand-rubric", protectRoute, handleExpandRubric);
router.post("/generate-feedback", protectRoute, handleGenerateFeedback);
router.post("/monitor-live", protectRoute, handleMonitorLive);
router.get("/evaluation/:sessionId", protectRoute, getEvaluationBySession);

export default router;
