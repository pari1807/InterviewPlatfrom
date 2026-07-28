import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { AppLayout } from "../components/layout/AppLayout";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import PerformanceTrendChart from "../components/charts/PerformanceTrendChart";
import SkillRadarChart from "../components/charts/SkillRadarChart";
import CategoryPieChart from "../components/charts/CategoryPieChart";
import {
  Code2,
  TrendingUp,
  Award,
  Sparkles,
  BookOpen,
  Bell,
  Video,
  Clock,
  CheckCircle2,
  UserCheck,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import axios from "../lib/axios";
import { getSocket } from "../lib/socket";
import toast from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";

// Invitation card shown to the candidate
function InvitationCard({ notification, onJoin }) {
  if (!notification) return null;
  const isNew = !notification.isRead;
  const sessionId = notification.interview?._id || (typeof notification.interview === "string" ? notification.interview : null);

  let createdAt = "";
  try {
    if (notification.createdAt) {
      createdAt = new Date(notification.createdAt).toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  } catch (e) {
    createdAt = "";
  }

  return (
    <div
      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isNew
          ? "bg-emerald-50/60 border-emerald-300/80 shadow-sm"
          : "bg-white border-slate-200/80"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-xl shrink-0 ${isNew ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
          <Video className="size-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="font-bold text-slate-900 text-sm">{notification.title || "Interview Invitation"}</h4>
            {isNew && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-extrabold uppercase">
                New
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{notification.message || ""}</p>
          <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <Clock className="size-3" />
            {createdAt}
          </p>
        </div>
      </div>

      {sessionId && (
        <Link to={`/session/${sessionId}`} onClick={() => notification._id && onJoin(notification._id)}>
          <Button variant="emeraldGradient" size="sm" className="shrink-0 w-full sm:w-auto">
            <Video className="size-3.5" />
            <span>Join Interview</span>
          </Button>
        </Link>
      )}
    </div>
  );
}

export default function CandidateDashboardPage() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [dbUser, setDbUser] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/notifications");
      setNotifications(Array.isArray(res.data?.notifications) ? res.data.notifications : []);
    } catch (err) {
      console.log("Error fetching notifications:", err.message);
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get("/users/me");
      setDbUser(res.data?.user || null);
    } catch (err) {
      console.log("Error fetching user:", err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUser();

    // Real-time new notification via Socket.io
    const socket = getSocket();
    if (user?.id) socket.emit("register_user", { userId: user.id });

    const handleNewNotif = (newNotif) => {
      toast.custom(
        () => (
          <div className="bg-slate-900 text-white p-4 rounded-2xl border border-emerald-500/40 shadow-2xl flex items-start gap-3 max-w-sm">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-emerald-300">{newNotif?.title || "New Notification"}</p>
              <p className="text-xs text-slate-300 mt-0.5">{newNotif?.message || ""}</p>
            </div>
          </div>
        ),
        { duration: 6000 }
      );
      fetchNotifications();
    };

    socket.on("new_notification", handleNewNotif);
    return () => socket.off("new_notification", handleNewNotif);
  }, [user?.id]);

  const handleMarkRead = async (id) => {
    if (!id) return;
    try {
      await axios.post(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.log("Error marking read:", err.message);
    }
  };

  const handleCopyId = () => {
    if (!dbUser?.candidateId) return;
    navigator.clipboard.writeText(dbUser.candidateId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const safeNotifications = Array.isArray(notifications)
    ? notifications.filter((n) => n && typeof n === "object")
    : [];
  const pendingInvitations = safeNotifications.filter((n) => !n.isRead && n.type === "invitation");

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Candidate ID Hero */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-800 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <UserCheck className="size-3.5" />
              <span>Candidate Profile</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Welcome, {user?.firstName || "Candidate"}
            </h1>
            <p className="text-slate-300 text-sm max-w-lg">
              Share your unique Candidate Key with interviewers to receive live interview invitations.
            </p>
          </div>

          {/* Candidate Key Card */}
          <div
            onClick={handleCopyId}
            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/10 border border-white/20 cursor-pointer hover:bg-white/15 transition-all"
            title="Click to copy Candidate Key"
          >
            <div>
              <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest">
                Your Candidate Key
              </p>
              <p className="text-xl font-extrabold text-white font-mono tracking-widest">
                {dbUser?.candidateId || "Loading..."}
              </p>
            </div>
            {copied ? (
              <Check className="size-5 text-emerald-400 shrink-0" />
            ) : (
              <Copy className="size-5 text-slate-400 shrink-0" />
            )}
          </div>
        </div>

        {/* Interview Invitations Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                <Bell className="size-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Interview Invitations</h2>
                <p className="text-xs text-slate-500">
                  {pendingInvitations.length > 0
                    ? `${pendingInvitations.length} new invitation${pendingInvitations.length > 1 ? "s" : ""} waiting`
                    : "No pending invitations"}
                </p>
              </div>
            </div>
            {pendingInvitations.length > 0 && (
              <Badge variant="emerald" size="sm">
                {pendingInvitations.length} New
              </Badge>
            )}
          </div>

          {loadingNotifications ? (
            <div className="flex items-center justify-center py-10 text-slate-400 gap-2">
              <Loader2 className="size-5 animate-spin text-emerald-500" />
              <span className="text-sm">Loading invitations...</span>
            </div>
          ) : safeNotifications.length === 0 ? (
            <Card className="p-8 text-center">
              <Bell className="size-10 mx-auto mb-3 text-slate-300" />
              <p className="font-bold text-slate-600">No interview invitations yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Share your Candidate Key with interviewers. Invitations appear here in real time.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {safeNotifications.map((n) => (
                <InvitationCard key={n._id || Math.random()} notification={n} onJoin={handleMarkRead} />
              ))}
            </div>
          )}
        </div>

        {/* Analytics Charts */}
        <div>
          <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="size-5 text-emerald-600" />
            Performance Analytics
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                  <TrendingUp className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Score Trajectory</h3>
                  <p className="text-xs text-slate-500">AI evaluation ratings across sessions</p>
                </div>
              </div>
              <PerformanceTrendChart />
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-200/60">
                  <Award className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Skill Competency Radar</h3>
                  <p className="text-xs text-slate-500">Multidimensional score breakdown</p>
                </div>
              </div>
              <SkillRadarChart />
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                  <BookOpen className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Problems by Topic</h3>
                  <p className="text-xs text-slate-500">Distribution across algorithmic domains</p>
                </div>
              </div>
              <CategoryPieChart />
            </Card>

            <Card className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs mb-3">
                  <Sparkles className="size-4" />
                  <span>Quick Actions</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Interview Prep</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Practice coding problems to improve your algorithm skills before your next live interview.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Link to="/problems">
                  <Button variant="emeraldGradient" size="md" className="w-full">
                    <Code2 className="size-4" />
                    <span>Practice Problems</span>
                  </Button>
                </Link>
                <Link to="/history">
                  <Button variant="outline" size="md" className="w-full">
                    <CheckCircle2 className="size-4" />
                    <span>View Interview History</span>
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
