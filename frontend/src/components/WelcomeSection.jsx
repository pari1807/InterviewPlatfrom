import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Sparkles, Plus, Play, FileText, ArrowRight } from "lucide-react";
import { Button } from "./ui/Button";

export default function WelcomeSection({ onCreateSession }) {
  const { user } = useUser();

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8">
      {/* Decorative subtle ambient background shapes */}
      <div className="absolute -right-16 -top-16 size-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-32 -bottom-20 size-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold tracking-wide">
            <Sparkles className="size-3.5 text-emerald-400" />
            <span>AI Remote Interview Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent">
              {user?.firstName || "Candidate"}
            </span>
          </h1>

          <p className="text-emerald-100/80 text-sm sm:text-base leading-relaxed">
            Practice technical interviews with live peer collaboration, AI insights, and real-time code execution.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Button
            variant="emeraldGradient"
            size="lg"
            onClick={onCreateSession}
            className="w-full sm:w-auto shadow-lg shadow-emerald-950/40"
          >
            <Plus className="size-5" />
            <span>Start Interview</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40"
            onClick={onCreateSession}
          >
            <Play className="size-4" />
            <span>Practice Topic</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
