import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AppLayout } from "../components/layout/AppLayout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import ResumeCard from "../modules/ats/components/ResumeCard";
import { useResumeStore } from "../modules/ats/lib/store";
import { usePuterStore } from "../modules/ats/lib/puter";
import { resumes as initialResumes } from "../modules/ats/constants/index";
import { atsApi } from "../services/atsApi";
import { Sparkles, PlusIcon, UploadCloudIcon, CheckCircle2, ShieldCheck, LogIn, UserCheck, TrashIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function ATSAnalysisPage() {
  const { resumes, setResumes } = useResumeStore();
  const { kv } = usePuterStore();
  const navigate = useNavigate();
  const [puterUser, setPuterUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userDbReports, setUserDbReports] = useState([]);

  // Default 3 Reference Sample Templates
  const referenceTemplates = initialResumes.slice(0, 3);

  const initPuterAuthAndSync = async () => {
    if (typeof window === "undefined") return;

    // 1. Fetch User's Own MongoDB ATS Reports
    let dbReports = [];
    try {
      const data = await atsApi.getUserReports();
      if (data && data.reports) {
        dbReports = data.reports.map((r) => ({
          id: r._id,
          companyName: r.jobTitle || "Target Role",
          jobTitle: r.jobTitle || "Candidate",
          imagePath: "/images/resume_01.png",
          resumePath: "#",
          feedback: {
            overallScore: r.matchScore || 80,
            ATS: { score: r.matchScore || 80, tips: (r.strengths || []).map((s) => ({ type: "good", tip: s })) },
            toneAndStyle: { score: r.matchScore || 80, tips: [] },
            content: { score: r.matchScore || 80, tips: [] },
            structure: { score: r.matchScore || 80, tips: [] },
            skills: { score: r.matchScore || 80, tips: (r.missingKeywords || []).map((m) => ({ type: "improve", tip: `Add keyword: ${m}` })) },
          },
        }));
        setUserDbReports(dbReports);
      }
    } catch (err) {
      console.warn("MongoDB ATS reports fetch warning:", err.message);
    }

    // 2. Sync with Puter Cloud Storage
    const waitForPuter = async () => {
      let attempts = 0;
      while (!window.puter && attempts < 20) {
        await new Promise((r) => setTimeout(r, 150));
        attempts++;
      }
      return !!window.puter;
    };

    const hasPuter = await waitForPuter();
    let cloudResumes = [];

    if (hasPuter && window.puter.auth) {
      try {
        if (window.puter.auth.isSignedIn()) {
          const user = await window.puter.auth.getUser();
          setPuterUser(user);

          const kvPairs = await kv.list("resume:*", true);
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
                    imageDataUrl: data.imageDataUrl || "",
                    feedback: data.feedback,
                  };
                } catch (e) {
                  return null;
                }
              })
              .filter((r) => r !== null && !!r.feedback);
          }
        }
      } catch (err) {
        console.warn("Puter sync warning:", err);
      }
    }

    // Combine User's DB reports + Puter Cloud reports (excluding default samples)
    const userResumesMap = {};

    dbReports.forEach((r) => {
      userResumesMap[r.id] = r;
    });

    cloudResumes.forEach((cr) => {
      if (!["1", "2", "3"].includes(cr.id)) {
        userResumesMap[cr.id] = { ...userResumesMap[cr.id], ...cr };
      }
    });

    // Also include local user-created drafts
    const localData = localStorage.getItem("matchrate_resumes");
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        parsed.forEach((lr) => {
          if (!["1", "2", "3"].includes(lr.id)) {
            userResumesMap[lr.id] = { ...userResumesMap[lr.id], ...lr };
          }
        });
      } catch (e) {
        // ignore
      }
    }

    setResumes(Object.values(userResumesMap));
    setLoading(false);
  };

  const handlePuterOAuthSignIn = async () => {
    if (typeof window === "undefined" || !window.puter) {
      toast.error("Puter.js SDK is loading. Please try again in a moment.");
      return;
    }

    try {
      setIsAuthenticating(true);
      // Triggers Puter OAuth sign in modal
      await window.puter.auth.signIn();

      if (window.puter.auth.isSignedIn()) {
        const user = await window.puter.auth.getUser();
        setPuterUser(user);
        toast.success(`Connected to Puter Account: @${user?.username || "user"}`);
        initPuterAuthAndSync();
      }
    } catch (err) {
      console.error("Puter login error:", err);
      toast.error("Puter sign in cancelled or failed");
    } finally {
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
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
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <UserCheck className="size-3.5 text-emerald-600" />
                    Puter Cloud: @{puterUser.username}
                  </span>
                  <button
                    onClick={handlePuterOAuthSignIn}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                  >
                    Switch Account
                  </button>
                </div>
              ) : (
                <button
                  onClick={handlePuterOAuthSignIn}
                  disabled={isAuthenticating}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-1 rounded-full border border-indigo-200 cursor-pointer transition-colors"
                >
                  <LogIn className="size-3.5 text-indigo-600" />
                  {isAuthenticating ? "Opening Sign In Modal..." : "Sign In with Puter Cloud Account"}
                </button>
              )}
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Application <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Compatibility Tracker</span>
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Your personal ATS reports are synced with MongoDB & Puter Cloud.
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
              <span>MongoDB & Puter Cloud Multi-Sync</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Maximize Your Callback Rate with AI-Powered ATS Verification
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Target specific job titles and company requirements. Our Puter AI engine evaluates keywords, action verbs, formatting compliance, and skills match in real time, isolated exclusively to your account.
            </p>
            <div className="pt-2">
              <Button variant="emeraldGradient" size="md" onClick={() => navigate("/ats-analysis/upload")}>
                <PlusIcon className="size-4" />
                <span>Analyze New Resume Now</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Section 1: User's Account ATS Resumes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="size-5 text-emerald-600" />
              <span>Your Account Evaluated Resumes ({resumes.length})</span>
            </h2>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Synced with Your Account
            </span>
          </div>

          {resumes.length === 0 ? (
            <Card className="p-10 text-center space-y-4 bg-slate-50/50 border border-dashed border-slate-300">
              <UploadCloudIcon className="size-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Personal ATS Reports Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Import a PDF resume to generate your first ATS compatibility report saved directly to your account.
              </p>
              <Button variant="emeraldGradient" size="sm" onClick={() => navigate("/ats-analysis/upload")}>
                <PlusIcon className="size-4" />
                <span>Import Resume Now</span>
              </Button>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Reference Sample ATS Resumes */}
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Reference Sample Evaluations</h2>
              <p className="text-xs text-slate-500 mt-0.5">Reference ATS evaluations for top tech companies.</p>
            </div>
            <Badge variant="indigo" size="sm">
              3 Sample References
            </Badge>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {referenceTemplates.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
