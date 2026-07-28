import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getUserNotifications,
  markNotificationAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protectRoute, getUserNotifications);
router.post("/:id/read", protectRoute, markNotificationAsRead);

export default router;
