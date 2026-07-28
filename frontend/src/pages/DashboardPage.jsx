import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { useDbUser } from "../context/UserContext";
import { AppLayout } from "../components/layout/AppLayout";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { dbUser, loadingDbUser } = useDbUser();

  useEffect(() => {
    if (!loadingDbUser && dbUser) {
      if (dbUser.role === "host") {
        navigate("/host-dashboard", { replace: true });
      } else if (dbUser.role === "candidate") {
        navigate("/candidate-dashboard", { replace: true });
      }
      // If dbUser.role === "pending", stay on DashboardPage so RoleSelectionModal is displayed!
    }
  }, [dbUser, loadingDbUser, navigate]);

  if (loadingDbUser) {
    return (
      <div className="h-screen bg-slate-900 flex flex-col items-center justify-center text-white gap-3">
        <Loader2 className="size-8 animate-spin text-emerald-500" />
        <p className="text-sm font-semibold">Loading profile...</p>
      </div>
    );
  }

  // If role is pending, render inside AppLayout so RoleSelectionModal opens!
  return (
    <AppLayout>
      <div className="h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-3">
        <Loader2 className="size-8 animate-spin text-emerald-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Setting up your profile...</h2>
        <p className="text-xs text-slate-500 max-w-sm">
          Please select your role in the modal to continue as a Host or Candidate.
        </p>
      </div>
    </AppLayout>
  );
}
