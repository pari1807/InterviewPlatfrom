import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getCurrentUser,
  setUserRole,
  findCandidateById,
  getAllCandidates,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protectRoute, getCurrentUser);
router.post("/set-role", protectRoute, setUserRole);
router.get("/candidate/:candidateId", protectRoute, findCandidateById);
router.get("/candidates", protectRoute, getAllCandidates);

export default router;
