import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protectRoute, getUserNotifications);
router.post("/read-all", protectRoute, markAllNotificationsAsRead);
router.post("/:id/read", protectRoute, markNotificationAsRead);

export default router;
