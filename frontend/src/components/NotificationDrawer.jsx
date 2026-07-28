import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Bell, X, Check, Calendar, ArrowRight, Video, Sparkles } from "lucide-react";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import axios from "../lib/axios";
import { getSocket } from "../lib/socket";
import toast from "react-hot-toast";

export default function NotificationDrawer({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/notifications");
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.log("Error fetching notifications:", err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const socket = getSocket();
    socket.on("new_notification", (newNotif) => {
      toast.custom((t) => (
        <div className="bg-slate-900 text-white p-4 rounded-2xl border border-emerald-500/40 shadow-2xl flex items-start gap-3">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <Sparkles className="size-5" />
          </div>
          <div>
            <p className="font-bold text-sm text-emerald-300">{newNotif.title || "Interview Invitation"}</p>
            <p className="text-xs text-slate-300 mt-0.5">{newNotif.message}</p>
          </div>
        </div>
      ));
      fetchNotifications();
    });

    return () => socket.off("new_notification");
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.post(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.log("Error marking notification read:", err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                <Bell className="size-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Notifications & Invitations</h3>
                <p className="text-xs text-slate-500">{unreadCount} unread interview alerts</p>
              </div>
            </div>

            <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100">
              <X className="size-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`p-4 rounded-2xl border transition-all ${
                    !n.isRead
                      ? "bg-emerald-50/50 border-emerald-300/80 shadow-xs"
                      : "bg-white border-slate-200/80 opacity-80"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-bold text-slate-900 text-xs">{n.title}</h4>
                    {!n.isRead && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-extrabold uppercase">
                        NEW
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">{n.message}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: "2digit", minute: "2digit" })}
                    </span>

                    {n.interview?._id && (
                      <Link
                        to={`/session/${n.interview._id}`}
                        onClick={() => {
                          handleMarkAsRead(n._id);
                          onClose();
                        }}
                      >
                        <Button variant="emeraldGradient" size="sm">
                          <Video className="size-3.5" />
                          <span>Join Interview</span>
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 px-4 text-slate-400">
                <Bell className="size-10 mx-auto mb-2 opacity-50 text-slate-400" />
                <p className="text-sm font-bold text-slate-700">No notifications yet</p>
                <p className="text-xs text-slate-400 mt-1">Scheduled interview invitations will appear here live.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
