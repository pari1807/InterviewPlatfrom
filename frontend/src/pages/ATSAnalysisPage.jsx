import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AppLayout } from "../components/layout/AppLayout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import ResumeCard from "../modules/ats/components/ResumeCard";
import { useResumeStore } from "../modules/ats/lib/store";
import { usePuterStore } from "../modules/ats/lib/puter";
import { resumes as initialResumes } from "../modules/ats/constants/index";
import { Sparkles, PlusIcon, UploadCloudIcon, CheckCircle2, ShieldCheck, LogIn, UserCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function ATSAnalysisPage() {
  const { resumes, setResumes } = useResumeStore();
  const { kv } = usePuterStore();
  const navigate = useNavigate();
  const [puterUser, setPuterUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const initPuterAuthAndSync = async () => {
    if (typeof window === "undefined") return;

    // Wait until window.puter is loaded from CDN
    const waitForPuter = async () => {
      let attempts = 0;
      while (!window.puter && attempts < 30) {
        await new Promise((r) => setTimeout(r, 150));
        attempts++;
      }
      return !!window.puter;
    };

    const hasPuter = await waitForPuter();
    if (!hasPuter) {
      console.warn("Puter.js script not detected, using local storage");
      return;
    }

    try {
      // Check if signed in, or prompt sign-in modal
      if (!window.puter.auth.isSignedIn()) {
        setIsAuthenticating(true);
        try {
          await window.puter.auth.signIn();
        } catch (signInErr) {
          console.warn("Puter sign-in modal closed or postponed:", signInErr);
        } finally {
          setIsAuthenticating(false);
        }
      }

      if (window.puter.auth.isSignedIn()) {
        const user = await window.puter.auth.getUser();
        setPuterUser(user);

        // Fetch cloud ATS resumes from Puter KV
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

        // Merge with local resumes
        const localData = localStorage.getItem("matchrate_resumes");
        let localResumes = localData ? JSON.parse(localData) : [...initialResumes];
        let merged = [...localResumes];

        for (const cr of cloudResumes) {
          const existsLocally = merged.some((lr) => lr.id === cr.id);
          if (!existsLocally) {
            merged.unshift(cr);
          }
        }

        setResumes(merged);
      }
    } catch (err) {
      console.error("Puter auth / sync error:", err);
    }
  };

  const handleManualPuterLogin = async () => {
    if (typeof window === "undefined" || !window.puter) {
      toast.error("Puter.js SDK is loading. Please try again in a moment.");
      return;
    }

    try {
      setIsAuthenticating(true);
      await window.puter.auth.signIn();
      if (window.puter.auth.isSignedIn()) {
        const user = await window.puter.auth.getUser();
        setPuterUser(user);
        toast.success(`Connected to Puter Cloud as @${user?.username || "user"}`);
        initPuterAuthAndSync();
      }
    } catch (err) {
      console.error("Puter login error:", err);
      toast.error("Puter login cancelled or failed");
    } finally {
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
    // Initial local load
    const localData = typeof window !== "undefined" ? localStorage.getItem("matchrate_resumes") : null;
    if (localData) {
      try {
        setResumes(JSON.parse(localData));
      } catch (e) {
        setResumes([...initialResumes]);
      }
    } else {
      setResumes([...initialResumes]);
    }

    initPuterAuthAndSync();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-8 select-none">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="emerald" size="sm">
                <Sparkles className="size-3.5" />
                <span>ATS Resume Analyzer</span>
              </Badge>

              {puterUser ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <UserCheck className="size-3.5 text-emerald-600" />
                  Synced with Puter Cloud (@{puterUser.username})
                </span>
              ) : (
                <button
                  onClick={handleManualPuterLogin}
                  disabled={isAuthenticating}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200 cursor-pointer transition-colors"
                >
                  <LogIn className="size-3.5 text-indigo-600" />
                  {isAuthenticating ? "Opening Puter Sign In..." : "Connect Puter.js Account"}
                </button>
              )}
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
              <span>Puter AI Cloud Engine Active</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Maximize Your Callback Rate with AI-Powered ATS Verification
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Target specific job titles and company requirements. Our Puter AI engine evaluates keywords, action verbs, formatting compliance, and skills match in real time, synced directly to your Puter account.
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
