import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createInterviewByCandidateId,
  getCandidateInterviews,
  getHostInterviews,
} from "../controllers/interviewController.js";

const router = express.Router();

router.post("/create", protectRoute, createInterviewByCandidateId);
router.get("/candidate-interviews", protectRoute, getCandidateInterviews);
router.get("/host-interviews", protectRoute, getHostInterviews);

export default router;
