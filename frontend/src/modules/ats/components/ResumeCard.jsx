import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";

export default function ResumeCard({ resume }) {
  const isMockResume = ["1", "2", "3"].includes(resume.id);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    let active = true;
    let url = "";

    const loadImg = async () => {
      if (!isMockResume && resume.imagePath) {
        try {
          if (typeof window !== "undefined" && window.puter && window.puter.fs) {
            const blob = await window.puter.fs.read(resume.imagePath);
            if (active) {
              url = URL.createObjectURL(blob);
              setImageUrl(url);
            }
          }
        } catch (err) {
          console.error("Failed to load preview image:", err);
        }
      } else {
        setImageUrl(resume.imagePath);
      }
    };

    loadImg();

    return () => {
      active = false;
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [resume, isMockResume]);

  const renderSrc = resume.imageDataUrl || imageUrl || (isMockResume ? resume.imagePath : "");

  return (
    <Link
      to={`/ats-analysis/report/${resume.id}`}
      className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-emerald-500 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-[430px] w-full group"
    >
      <div className="flex flex-row justify-between items-start gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="text-base font-bold text-slate-900 truncate">{resume.companyName}</h3>
          <p className="text-xs font-semibold text-emerald-600 truncate">{resume.jobTitle}</p>
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={resume.feedback?.overallScore || 75} />
        </div>
      </div>

      <div className="relative mt-3 flex-1 w-full rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
        <img
          src={renderSrc}
          alt={`${resume.jobTitle || "Resume"} at ${resume.companyName || "Unknown"}`}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent pointer-events-none" />
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <span className="font-medium text-slate-400">Puter AI Assessment</span>
        <span className="font-semibold text-emerald-600 group-hover:text-emerald-700 flex items-center gap-1">
          View Report
          <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
