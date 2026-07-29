import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import upload from "../lib/multer.js";
import {
  createResume,
  getUserResumes,
  getPublicResumeById,
  getResumeById,
  updateResume,
  deleteResume,
} from "../controllers/resumeController.js";

const router = express.Router();

// Private CRUD Resume Routes (Authenticated)
router.post("/create", protectRoute, createResume);
router.put("/update", protectRoute, upload.single("image"), updateResume);
router.delete("/:resumeId", protectRoute, deleteResume);
router.get("/my-resumes", protectRoute, getUserResumes);
router.get("/detail/:resumeId", protectRoute, getResumeById);
router.get("/", protectRoute, getUserResumes);

// Public Resume Route (Unauthenticated)
router.get("/public/:resumeId", getPublicResumeById);

export default router;
