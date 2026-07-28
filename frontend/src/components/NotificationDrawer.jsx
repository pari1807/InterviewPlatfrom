import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Bell, X, Calendar, Video, Sparkles, CheckCheck, Loader2 } from "lucide-react";
import { Button } from "./ui/Button";
import axios from "../lib/axios";
import { getSocket } from "../lib/socket";
import toast from "react-hot-toast";

export default function NotificationDrawer({ isOpen, onClose, onUnreadCountChange }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/notifications");
      const list = Array.isArray(res.data?.notifications) ? res.data.notifications : [];
      const count = typeof res.data?.unreadCount === "number" ? res.data.unreadCount : 0;
      setNotifications(list);
      setUnreadCount(count);
      if (onUnreadCountChange) onUnreadCountChange(count);
    } catch (err) {
      console.log("Error fetching notifications:", err.message);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const socket = getSocket();
    const handleNewNotif = () => {
      if (isOpen) fetchNotifications();
    };

    socket.on("new_notification", handleNewNotif);
    return () => socket.off("new_notification", handleNewNotif);
  }, [isOpen]);

  const handleMarkAsRead = async (id) => {
    if (!id) return;
    try {
      await axios.post(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.log("Error marking notification read:", err.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.post("/notifications/read-all");
      toast.success("All notifications marked as read!");
      fetchNotifications();
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
  };

  if (!isOpen) return null;

  const validNotifications = Array.isArray(notifications)
    ? notifications.filter((n) => n && typeof n === "object")
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                <Bell className="size-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Notifications</h3>
                <p className="text-xs text-slate-500">{unreadCount} unread alert{unreadCount !== 1 ? "s" : ""}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1"
                  title="Mark all as read"
                >
                  <CheckCheck className="size-3.5" />
                  <span>Read all</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                <Loader2 className="size-6 animate-spin text-emerald-500" />
                <p className="text-xs font-semibold">Fetching latest alerts...</p>
              </div>
            ) : validNotifications.length > 0 ? (
              validNotifications.map((n) => {
                const senderName = n?.sender?.name || "Host / Interviewer";
                const senderImage = n?.sender?.profileImage || null;
                const sessionId = n?.interview?._id || (typeof n?.interview === "string" ? n.interview : null);
                const notificationTitle = n?.title || "Interview Notification";
                const notificationMessage = n?.message || "";
                const isRead = Boolean(n?.isRead);

                let formattedTime = "";
                try {
                  if (n?.createdAt) {
                    formattedTime = new Date(n.createdAt).toLocaleTimeString([], { hour: "2digit", minute: "2digit" });
                  }
                } catch (e) {
                  formattedTime = "";
                }

                return (
                  <div
                    key={n._id || Math.random()}
                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      !isRead
                        ? "bg-emerald-50/60 border-emerald-300/80 shadow-xs ring-1 ring-emerald-500/10"
                        : "bg-white border-slate-200/80"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        {senderImage ? (
                          <img
                            src={senderImage}
                            alt={senderName}
                            className="size-8 rounded-lg object-cover border border-emerald-300 shrink-0"
                          />
                        ) : (
                          <div className="size-8 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {senderName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs">{notificationTitle}</h4>
                          <p className="text-[11px] text-slate-500">From {senderName}</p>
                        </div>
                      </div>

                      {!isRead && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-extrabold uppercase shrink-0">
                          NEW
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">{notificationMessage}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                        <Calendar className="size-3" />
                        {formattedTime}
                      </span>

                      {sessionId && (
                        <Link
                          to={`/session/${sessionId}`}
                          onClick={() => {
                            if (n._id) handleMarkAsRead(n._id);
                            onClose();
                          }}
                        >
                          <Button variant="emeraldGradient" size="sm">
                            <Video className="size-3.5" />
                            <span>Join Session</span>
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 px-4 text-slate-400 space-y-2">
                <Bell className="size-10 mx-auto opacity-40 text-slate-400" />
                <p className="text-sm font-bold text-slate-700">No notifications yet</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  When a host schedules an interview with your Candidate ID, invitations will appear here instantly.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
