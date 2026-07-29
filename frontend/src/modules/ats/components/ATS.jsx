import React, { useState } from "react";

export default function ATS({ score = 80, suggestions = [] }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-300">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
      >
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
          <h3 className="font-bold text-slate-900 text-sm tracking-tight sm:text-base">ATS Compliance Metrics</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${score}%` }} />
            </div>
            <span className="text-xs font-bold text-slate-700">{score}% Compliance</span>
          </div>
          <svg 
            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? "transform rotate-180" : ""}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1000px] border-t border-slate-100" : "max-h-0 overflow-hidden"}`}>
        <div className="p-6 space-y-3">
          {suggestions && suggestions.length > 0 ? (
            suggestions.map((tipObj, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex items-start gap-3 text-xs leading-relaxed transition-all duration-200
                  ${tipObj.type === "good"
                    ? "bg-emerald-50/50 border-emerald-100 text-slate-800"
                    : "bg-amber-50/50 border-amber-100 text-slate-800"
                  }
                `}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {tipObj.type === "good" ? (
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-amber-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                </div>
                <p className="font-semibold text-slate-800">{tipObj.tip}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic">No specific recommendations recorded for this section.</p>
          )}
        </div>
      </div>
    </div>
  );
}
