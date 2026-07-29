import React from "react";
import ScoreCircle from "./ScoreCircle";

export default function Summary({ feedback }) {
  const score = feedback?.overallScore || 75;
  let statusText = "Needs Refinement";
  let statusColor = "text-amber-700 bg-amber-50 border-amber-200";
  
  if (score >= 80) {
    statusText = "Excellent Compliance";
    statusColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
  } else if (score >= 65) {
    statusText = "Highly Compatible";
    statusColor = "text-teal-700 bg-teal-50 border-teal-200";
  }

  const atsScore = feedback?.ATS?.score || 80;
  const toneScore = feedback?.toneAndStyle?.score || 80;
  const contentScore = feedback?.content?.score || 80;
  const skillsScore = feedback?.skills?.score || 80;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
            {statusText}
          </span>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Application Compatibility Rating</h3>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md leading-relaxed">
            Your resume was analyzed against target job requirements. The score reflects ATS parsing, keyword coverage, and tone compliance.
          </p>
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={score} />
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
        {[
          { label: "ATS Score", val: atsScore, color: "bg-emerald-600" },
          { label: "Tone & Style", val: toneScore, color: "bg-teal-600" },
          { label: "Content", val: contentScore, color: "bg-indigo-600" },
          { label: "Skills", val: skillsScore, color: "bg-purple-600" },
        ].map((item, idx) => (
          <div key={idx} className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</span>
            <div className="flex items-center justify-between">
              <span className="text-base font-extrabold text-slate-800">{item.val}%</span>
              <div className={`${item.color} w-2 h-2 rounded-full`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
