import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { AppLayout } from "../components/layout/AppLayout";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import Summary from "../modules/ats/components/Summary";
import ATS from "../modules/ats/components/ATS";
import Details from "../modules/ats/components/Details";
import { useResumeStore } from "../modules/ats/lib/store";
import { usePuterStore } from "../modules/ats/lib/puter";
import { ArrowLeft, Loader2, FileText, CheckCircle2 } from "lucide-react";

export default function ATSReportDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { resumes } = useResumeStore();
  const { kv, fs, isLoading } = usePuterStore();

  const [resume, setResume] = useState(null);
  const [isLoadingKV, setIsLoadingKV] = useState(true);

  useEffect(() => {
    const found = resumes.find((r) => r.id === id);
    if (found) {
      setResume(found);
      setIsLoadingKV(false);
    } else {
      let localFound = null;
      if (typeof window !== "undefined") {
        const localData = localStorage.getItem("matchrate_resumes");
        if (localData) {
          try {
            const list = JSON.parse(localData);
            localFound = list.find((r) => r.id === id) || null;
          } catch (e) {
            console.error(e);
          }
        }
      }

      if (localFound) {
        setResume(localFound);
        setIsLoadingKV(false);
      } else if (typeof window !== "undefined" && window.puter && window.puter.auth && window.puter.auth.isSignedIn()) {
        const loadFromKV = async () => {
          try {
            const dataStr = await kv.get(`resume:${id}`);
            if (dataStr) {
              setResume(typeof dataStr === "string" ? JSON.parse(dataStr) : dataStr);
            }
          } catch (err) {
            console.error("Failed to load resume from Puter KV:", err);
          } finally {
            setIsLoadingKV(false);
          }
        };
        loadFromKV();
      } else {
        setIsLoadingKV(false);
      }
    }
  }, [id, resumes]);

  const isMockResume = resume ? ["1", "2", "3"].includes(resume.id) : false;
  const [pdfUrl, setPdfUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (!resume || isLoading) return;

    let active = true;
    let urlPdf = "";
    let urlImg = "";

    const loadAssets = async () => {
      if (!isMockResume && resume.resumePath && resume.resumePath !== "#") {
        try {
          if (typeof window !== "undefined" && window.puter && window.puter.fs) {
            const rawBlob = await fs.read(resume.resumePath);
            const pdfBlob = new Blob([rawBlob], { type: "application/pdf" });
            if (active) {
              urlPdf = URL.createObjectURL(pdfBlob);
              setPdfUrl(urlPdf);
            }
          }
        } catch (err) {
          console.error("Failed to load PDF from Puter Storage:", err);
        }
      }

      if (!isMockResume && resume.imagePath) {
        try {
          if (typeof window !== "undefined" && window.puter && window.puter.fs) {
            const rawBlob = await fs.read(resume.imagePath);
            const imgBlob = new Blob([rawBlob], { type: "image/png" });
            if (active) {
              urlImg = URL.createObjectURL(imgBlob);
              setImageUrl(urlImg);
            }
          }
        } catch (err) {
          console.error("Failed to load image preview from Puter Storage:", err);
        }
      } else if (isMockResume) {
        setImageUrl(resume.imagePath);
      }
    };

    loadAssets();

    return () => {
      active = false;
      if (urlPdf) URL.revokeObjectURL(urlPdf);
      if (urlImg) URL.revokeObjectURL(urlImg);
    };
  }, [resume, isMockResume, isLoading, fs]);

  if (isLoadingKV) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="size-10 text-emerald-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading ATS Evaluation from Puter Cloud...</p>
        </div>
      </AppLayout>
    );
  }

  if (!resume) {
    return (
      <AppLayout>
        <Card className="max-w-md mx-auto p-8 text-center space-y-4 bg-white border border-slate-200">
          <FileText className="size-12 text-slate-300 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">ATS Evaluation Not Found</h2>
          <p className="text-xs text-slate-500">The requested report does not exist or has been removed.</p>
          <Button variant="emeraldGradient" size="sm" onClick={() => navigate("/ats-analysis")}>
            Back to ATS Tracker
          </Button>
        </Card>
      </AppLayout>
    );
  }

  const { feedback } = resume;

  return (
    <AppLayout>
      <div className="space-y-6 select-none">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/ats-analysis")}>
            <ArrowLeft className="size-4" />
            <span>Back to ATS Tracker</span>
          </Button>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="size-3 text-emerald-600" />
              Puter.js Cloud Sync Active
            </span>
            <div className="text-right">
              <h2 className="text-base font-bold text-slate-900">{resume.companyName}</h2>
              <p className="text-xs text-emerald-600 font-semibold">{resume.jobTitle}</p>
            </div>
          </div>
        </div>

        {/* Detailed Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Document Preview Frame */}
          <div className="lg:col-span-5 lg:sticky lg:top-6">
            <Card className="p-5 bg-white border border-slate-200 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Resume Source Preview</h3>
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {isMockResume ? "Sample Document" : "PDF Source"}
                </span>
              </div>

              {pdfUrl ? (
                <div className="w-full h-[550px] rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <iframe src={pdfUrl} className="w-full h-full" title="Resume Document" />
                </div>
              ) : (
                <div className="flex items-center justify-center p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <img
                    src={imageUrl || "/images/resume_01.png"}
                    alt="Resume preview"
                    className="max-h-[500px] w-auto object-contain rounded-lg shadow-sm border border-slate-200 bg-white"
                  />
                </div>
              )}
            </Card>
          </div>

          {/* Right Side: Score Breakdowns */}
          <div className="lg:col-span-7 space-y-6">
            <Summary feedback={feedback} />
            <ATS score={feedback?.ATS?.score || 80} suggestions={feedback?.ATS?.tips || []} />
            <Details feedback={feedback} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
