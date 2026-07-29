import React, { useState } from "react";

export default function Details({ feedback }) {
  const [openSections, setOpenSections] = useState({
    tone: true,
    content: false,
    structure: false,
    skills: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sectionsList = [
    {
      key: "tone",
      title: "Tone & Style Compliance",
      data: feedback?.toneAndStyle || { score: 80, tips: [] },
      color: "bg-teal-500",
    },
    {
      key: "content",
      title: "Content & Achievement Quality",
      data: feedback?.content || { score: 80, tips: [] },
      color: "bg-emerald-500",
    },
    {
      key: "structure",
      title: "Formatting & Structure Compliance",
      data: feedback?.structure || { score: 80, tips: [] },
      color: "bg-indigo-500",
    },
    {
      key: "skills",
      title: "Skills Relevance & Match Rate",
      data: feedback?.skills || { score: 80, tips: [] },
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-4">
      {sectionsList.map((section, idx) => {
        const isSectionOpen = openSections[section.key];
        return (
          <div 
            key={idx} 
            className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-300"
          >
            <div 
              onClick={() => toggleSection(section.key)}
              className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${section.color}`} />
                <h4 className="font-bold text-slate-900 text-sm tracking-tight sm:text-base">{section.title}</h4>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${section.data.score}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{section.data.score}% Compatibility</span>
                </div>
                <svg 
                  className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isSectionOpen ? "transform rotate-180" : ""}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className={`transition-all duration-300 ease-in-out ${isSectionOpen ? "max-h-[1500px] border-t border-slate-100" : "max-h-0 overflow-hidden"}`}>
              <div className="p-6 space-y-4">
                {section.data.tips && section.data.tips.length > 0 ? (
                  section.data.tips.map((tipObj, tipIdx) => (
                    <div
                      key={tipIdx}
                      className={`p-4 rounded-xl border flex flex-col gap-1.5 transition-all duration-200
                        ${tipObj.type === "good"
                          ? "bg-emerald-50/40 border-emerald-100 text-slate-800"
                          : "bg-amber-50/40 border-amber-100 text-slate-800"
                        }
                      `}
                    >
                      <div className="flex items-start gap-2.5 text-xs font-bold">
                        <div className="flex-shrink-0 mt-0.5">
                          {tipObj.type === "good" ? (
                            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          )}
                        </div>
                        <span className="text-slate-800 leading-tight">{tipObj.tip}</span>
                      </div>
                      {tipObj.explanation && (
                        <p className="text-[11px] text-slate-500 pl-6.5 leading-relaxed font-medium">
                          {tipObj.explanation}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No specific recommendations recorded for this section.</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
