import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { AppLayout } from "../components/layout/AppLayout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import ResumeCard from "../modules/ats/components/ResumeCard";
import { useResumeStore } from "../modules/ats/lib/store";
import { usePuterStore } from "../modules/ats/lib/puter";
import { resumes as initialResumes } from "../modules/ats/constants/index";
import { Sparkles, PlusIcon, UploadCloudIcon, CheckCircle2, ShieldCheck } from "lucide-react";

export default function ATSAnalysisPage() {
  const { resumes, setResumes } = useResumeStore();
  const { kv } = usePuterStore();
  const navigate = useNavigate();

  useEffect(() => {
    const syncWithKV = async () => {
      try {
        const localData = typeof window !== "undefined" ? localStorage.getItem("matchrate_resumes") : null;
        let localResumes = [];
        if (localData) {
          try {
            localResumes = JSON.parse(localData);
          } catch (e) {
            console.error("Failed to parse local resumes cache:", e);
          }
        }

        if (localResumes.length === 0) {
          localResumes = [...initialResumes];
          if (typeof window !== "undefined") {
            localStorage.setItem("matchrate_resumes", JSON.stringify(localResumes));
          }
        }

        setResumes(localResumes);

        if (typeof window !== "undefined" && window.puter && window.puter.auth) {
          try {
            if (!window.puter.auth.isSignedIn()) {
              await window.puter.auth.signIn();
            }

            const kvPairs = await kv.list("resume:*", true);
            let cloudResumes = [];
            if (kvPairs && kvPairs.length > 0) {
              cloudResumes = kvPairs
                .map((pair) => {
                  try {
                    const data = typeof pair.value === "string" ? JSON.parse(pair.value) : pair.value;
                    return {
                      id: data.id,
                      companyName: data.companyName,
                      jobTitle: data.jobTitle,
                      imagePath: data.imagePath,
                      resumePath: data.resumePath,
                      feedback: data.feedback,
                    };
                  } catch (e) {
                    return null;
                  }
                })
                .filter((r) => r !== null && !!r.feedback);
            }

            let merged = [...localResumes];
            for (const cr of cloudResumes) {
              const existsLocally = merged.some((lr) => lr.id === cr.id);
              if (!existsLocally) {
                merged.unshift(cr);
              }
            }

            setResumes(merged);
          } catch (err) {
            console.warn("Puter sync warning:", err);
          }
        }
      } catch (err) {
        console.error("Sync error:", err);
      }
    };

    syncWithKV();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-8 select-none">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="emerald" size="sm">
                <Sparkles className="size-3.5" />
                <span>ATS Resume Analyzer</span>
              </Badge>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="size-3 text-emerald-600" />
                Connected with Puter.js Cloud Sync
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Application <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Compatibility Tracker</span>
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Analyze your resume against target job descriptions and optimize ATS match rates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="emeraldGradient" size="md" onClick={() => navigate("/ats-analysis/upload")}>
              <UploadCloudIcon className="size-4" />
              <span>Import Resume for ATS Analysis</span>
            </Button>
          </div>
        </div>

        {/* Hero Banner CTA Card */}
        <Card className="p-8 bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-900 text-white border-0 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="size-4 text-emerald-400" />
              <span>ATS Score Optimization Engine</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Maximize Your Callback Rate with AI-Powered ATS Verification
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Target specific job titles and company requirements. Our Puter AI engine evaluates keywords, action verbs, formatting compliance, and skills match in real time.
            </p>
            <div className="pt-2">
              <Button variant="emeraldGradient" size="md" onClick={() => navigate("/ats-analysis/upload")}>
                <PlusIcon className="size-4" />
                <span>Analyze New Resume Now</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Evaluated Resumes List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-xl font-bold text-slate-900">
              Evaluated Applications ({resumes.length})
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Click any report card to view full ATS match metrics
            </span>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
