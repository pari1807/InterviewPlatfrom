import React, { useState } from "react";
import { Crown, UserCheck, Sparkles, Check, ArrowRight } from "lucide-react";
import { Button } from "./ui/Button";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export default function RoleSelectionModal({ isOpen, onRoleSelected, userCandidateId }) {
  const [selectedRole, setSelectedRole] = useState("candidate");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmitRole = async () => {
    setIsSubmitting(true);
    try {
      const res = await axios.post("/users/set-role", { role: selectedRole });
      if (res.data?.user) {
        toast.success(`Welcome! Registered as ${selectedRole === "host" ? "Host" : "Candidate"} successfully.`);
        if (onRoleSelected) onRoleSelected(res.data.user);
      } else {
        throw new Error("Server did not return updated user");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to save role. Please try again.";
      console.error("[RoleModal] set-role failed:", msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="size-14 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Sparkles className="size-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome to Talent <span className="text-emerald-600">IQ</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Select how you want to use the platform today. You can switch roles later in settings.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Candidate Card */}
          <div
            onClick={() => setSelectedRole("candidate")}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedRole === "candidate"
                ? "bg-emerald-50/60 border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                : "bg-slate-50 border-slate-200 hover:border-slate-300"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                  <UserCheck className="size-5" />
                </div>
                {selectedRole === "candidate" && (
                  <span className="size-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="size-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Candidate</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Practice coding screens, receive live AI feedback, and join company interviews via Candidate ID.
              </p>
            </div>

            {userCandidateId && (
              <div className="mt-3 pt-2 border-t border-emerald-200/60 text-[10px] font-mono text-emerald-800 font-bold">
                ID: {userCandidateId}
              </div>
            )}
          </div>

          {/* Host Card */}
          <div
            onClick={() => setSelectedRole("host")}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedRole === "host"
                ? "bg-emerald-50/60 border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                : "bg-slate-50 border-slate-200 hover:border-slate-300"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
                  <Crown className="size-5" />
                </div>
                {selectedRole === "host" && (
                  <span className="size-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="size-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Host / Interviewer</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Search candidate IDs, host live 1-on-1 sessions, and expand evaluation rubrics with AI.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <Button
          variant="emeraldGradient"
          size="lg"
          onClick={handleSubmitRole}
          disabled={isSubmitting}
          className="w-full shadow-lg"
        >
          <span>Continue as {selectedRole === "host" ? "Host / Interviewer" : "Candidate"}</span>
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
