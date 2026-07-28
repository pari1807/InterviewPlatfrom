import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
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
  LayoutDashboard,
} from "lucide-react";
import axios from "../lib/axios";
import { getSocket } from "../lib/socket";
import toast from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";
import { useDbUser } from "../context/UserContext";

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
      className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        isNew
          ? "bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-400/60 shadow-md ring-1 ring-emerald-500/20"
          : "bg-white border-slate-200/80"
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div className={`p-3 rounded-2xl shrink-0 ${isNew ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30" : "bg-slate-100 text-slate-500"}`}>
          <Video className="size-6" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-extrabold text-slate-900 text-base">{notification.title || "Interview Invitation"}</h4>
            {isNew && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-wide">
                Live Invite
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{notification.message || ""}</p>
          <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1 font-medium">
            <Clock className="size-3" />
            {createdAt}
          </p>
        </div>
      </div>

      {sessionId && (
        <Link to={`/session/${sessionId}`} onClick={() => notification._id && onJoin(notification._id)}>
          <Button variant="emeraldGradient" size="md" className="shrink-0 w-full sm:w-auto shadow-md">
            <Video className="size-4" />
            <span>Join Live Interview</span>
          </Button>
        </Link>
      )}
    </div>
  );
}

export default function CandidateDashboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { dbUser, candidateKey, loadingDbUser } = useDbUser();
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [copied, setCopied] = useState(false);

  // Role Guard: Redirect hosts away from candidate dashboard
  useEffect(() => {
    if (!loadingDbUser && dbUser && dbUser.role === "host") {
      navigate("/host-dashboard", { replace: true });
    }
    if (!loadingDbUser && dbUser && dbUser.role === "pending") {
      navigate("/dashboard", { replace: true });
    }
  }, [dbUser, loadingDbUser, navigate]);

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

  useEffect(() => {
    if (!dbUser) return;
    fetchNotifications();

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
  }, [user?.id, dbUser]);

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
    if (!candidateKey) return;
    navigator.clipboard.writeText(candidateKey);
    setCopied(true);
    toast.success("Candidate Key copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const safeNotifications = Array.isArray(notifications)
    ? notifications.filter((n) => n && typeof n === "object")
    : [];
  const pendingInvitations = safeNotifications.filter((n) => !n.isRead && n.type === "invitation");

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loadingDbUser || !dbUser) {
    return (
      <div className="h-screen bg-slate-900 flex flex-col items-center justify-center text-white gap-3">
        <Loader2 className="size-8 animate-spin text-emerald-500" />
        <p className="text-sm font-semibold">Loading Candidate Dashboard...</p>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Candidate Header Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-800 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <LayoutDashboard className="size-3.5" />
              <span>Candidate Dashboard</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome, {dbUser?.name || user?.firstName || "Candidate"}
            </h1>
            <p className="text-slate-300 text-sm max-w-lg">
              Share your unique Candidate Key with interviewers to receive live interview invitations.
            </p>
          </div>

          {/* Candidate Key Display Card */}
          <div
            onClick={handleCopyId}
            className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all cursor-pointer group shrink-0"
            title="Click to copy Candidate Key"
          >
            <div>
              <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest">
                Your Candidate Key
              </p>
              <p className="text-2xl font-extrabold text-white font-mono tracking-widest mt-0.5">
                {candidateKey || "CAND-..."}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/10 group-hover:bg-white/20 text-white transition-all">
              {copied ? (
                <Check className="size-5 text-emerald-400 shrink-0" />
              ) : (
                <Copy className="size-5 text-slate-300 shrink-0" />
              )}
            </div>
          </div>
        </div>

        {/* Live Interview Invitations Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                <Bell className="size-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Live Interview Invitations</h2>
                <p className="text-xs text-slate-500">
                  {pendingInvitations.length > 0
                    ? `${pendingInvitations.length} new invitation${pendingInvitations.length > 1 ? "s" : ""} waiting`
                    : "No pending invitations"}
                </p>
              </div>
            </div>
            {pendingInvitations.length > 0 && (
              <Badge variant="emerald" size="sm">
                {pendingInvitations.length} New Invite{pendingInvitations.length > 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          {loadingNotifications ? (
            <div className="flex items-center justify-center py-10 text-slate-400 gap-2">
              <Loader2 className="size-5 animate-spin text-emerald-500" />
              <span className="text-sm">Checking for invitations...</span>
            </div>
          ) : safeNotifications.length === 0 ? (
            <Card className="p-8 text-center">
              <Bell className="size-10 mx-auto mb-3 text-slate-300" />
              <p className="font-bold text-slate-600">No interview invitations yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Share your Candidate Key (<span className="font-mono font-bold text-emerald-600">{candidateKey}</span>) with interviewers to receive invitations in real time.
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

        {/* Quick Actions & Practice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 flex flex-col justify-between bg-gradient-to-br from-white to-slate-50">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs mb-3">
                <Code2 className="size-4" />
                <span>Coding Practice</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Practice Technical Screens</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Solve real algorithmic coding problems across Data Structures, Dynamic Programming, and System Design with live Gemini AI feedback.
              </p>
            </div>

            <div className="mt-6">
              <Link to="/problems">
                <Button variant="emeraldGradient" size="md" className="w-full">
                  <Code2 className="size-4" />
                  <span>Start Practice Problems</span>
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6 flex flex-col justify-between bg-gradient-to-br from-white to-slate-50">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs mb-3">
                <CheckCircle2 className="size-4" />
                <span>Interview Records</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Previous Interviews</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Review code recordings, host feedback notes, and AI evaluation metrics from your past completed live interviews.
              </p>
            </div>

            <div className="mt-6">
              <Link to="/history">
                <Button variant="outline" size="md" className="w-full">
                  <CheckCircle2 className="size-4" />
                  <span>View Interview History</span>
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Candidate Analytics Section (Secondary) */}
        <div>
          <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="size-5 text-emerald-600" />
            Candidate Skill Analytics
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
        </div>
      </div>
    </AppLayout>
  );
}
