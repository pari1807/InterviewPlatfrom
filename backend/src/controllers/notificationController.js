import Notification from "../models/Notification.js";

export async function getUserNotifications(req, res) {
  try {
    const recipientId = req.user._id;

    const notifications = await Notification.find({ recipient: recipientId })
      .populate("sender", "name profileImage email candidateId")
      .populate("interview")
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    console.error("getUserNotifications error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function markNotificationAsRead(req, res) {
  try {
    const { id } = req.params;
    const recipientId = req.user._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: recipientId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ notification });
  } catch (error) {
    console.error("markNotificationAsRead error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function markAllNotificationsAsRead(req, res) {
  try {
    const recipientId = req.user._id;

    await Notification.updateMany({ recipient: recipientId, isRead: false }, { isRead: true });

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("markAllNotificationsAsRead error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
