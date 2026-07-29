import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { useDbUser } from "../context/UserContext";
import { AppLayout } from "../components/layout/AppLayout";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { dbUser, loadingDbUser, fetchError, refetchUser } = useDbUser();

  useEffect(() => {
    if (!loadingDbUser && dbUser) {
      if (dbUser.role === "host") {
        navigate("/host-dashboard", { replace: true });
      } else if (dbUser.role === "candidate") {
        navigate("/candidate-dashboard", { replace: true });
      }
      // role === "pending" → stay here, RoleSelectionModal will open
    }
  }, [dbUser, loadingDbUser, navigate]);

  // Loading state
  if (loadingDbUser) {
    return (
      <div className="h-screen bg-slate-900 flex flex-col items-center justify-center text-white gap-3">
        <Loader2 className="size-8 animate-spin text-emerald-500" />
        <p className="text-sm font-semibold">Loading your profile...</p>
      </div>
    );
  }

  // Network / auth error state — show retry instead of infinite spinner
  if (fetchError) {
    return (
      <div className="h-screen bg-slate-900 flex flex-col items-center justify-center text-white gap-4 p-6">
        <div className="size-14 rounded-2xl bg-red-500/20 flex items-center justify-center">
          <AlertCircle className="size-7 text-red-400" />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold">Failed to load profile</h2>
          <p className="text-sm text-slate-400 max-w-xs">
            There was a problem connecting to the server. Please check your internet connection and try again.
          </p>
        </div>
        <button
          onClick={refetchUser}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all"
        >
          <RefreshCw className="size-4" />
          Retry
        </button>
      </div>
    );
  }

  // Pending role — render AppLayout so RoleSelectionModal can open
  return (
    <AppLayout>
      <div className="h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-3">
        <Loader2 className="size-8 animate-spin text-emerald-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Setting up your profile...</h2>
        <p className="text-xs text-slate-500 max-w-sm">
          Please select your role in the popup to continue as a Host or Candidate.
        </p>
      </div>
    </AppLayout>
  );
}
