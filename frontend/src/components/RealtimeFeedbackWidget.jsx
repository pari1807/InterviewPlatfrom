import React from "react";
import { Zap, Activity, CheckCircle, AlertCircle } from "lucide-react";
import { Progress } from "./ui/Progress";

export default function RealtimeFeedbackWidget({ liveData }) {
  const codeQuality = liveData?.codeQualityScore ?? 88;
  const progress = liveData?.progressPercentage ?? 65;
  const observation = liveData?.observation || "Candidate actively coding main solution logic.";
  const intervention = liveData?.suggestedIntervention;

  return (
    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-white space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-emerald-400 animate-pulse" />
          <span className="font-bold text-xs">Real-Time AI Monitoring</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
          LIVE OBSERVATION
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1 font-medium">
            <span>Code Quality Score</span>
            <span className="font-bold text-emerald-400">{codeQuality}%</span>
          </div>
          <Progress value={codeQuality} variant="emerald" />
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1 font-medium">
            <span>Progress</span>
            <span className="font-bold text-teal-400">{progress}%</span>
          </div>
          <Progress value={progress} variant="gradient" />
        </div>
      </div>

      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
        <p className="leading-relaxed"><strong className="text-emerald-400">Status:</strong> {observation}</p>
        {intervention && (
          <p className="mt-1 text-amber-300 leading-relaxed font-medium">
            💡 <strong>Suggested Hint:</strong> {intervention}
          </p>
        )}
      </div>
    </div>
  );
}
