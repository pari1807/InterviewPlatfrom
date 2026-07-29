import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import ResumePreview from "../modules/resume/components/ResumePreview";
import { resumeApi } from "../services/resumeApi";
import { dummyResumeData } from "../modules/resume/assets/assets";
import { Button } from "../components/ui/Button";
import { Download, ArrowLeft, Loader2, Sparkles } from "lucide-react";

export default function ResumePreviewPage() {
  const { resumeId } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      setLoading(true);
      try {
        const data = await resumeApi.getPublicResumeById(resumeId);
        if (data && data.resume) {
          setResume(data.resume);
          setLoading(false);
          return;
        }
      } catch (err) {
        try {
          const privateData = await resumeApi.getResumeById(resumeId);
          if (privateData && privateData.resume) {
            setResume(privateData.resume);
            setLoading(false);
            return;
          }
        } catch (privErr) {}
      }

      // Check localStorage draft
      const draftKey = `resume-builder:draft:${resumeId}`;
      const stored = localStorage.getItem(draftKey);
      if (stored) {
        try {
          setResume(JSON.parse(stored));
          setLoading(false);
          return;
        } catch (e) {}
      }

      // Check dummy data fallback
      const foundDummy = dummyResumeData.find((r) => r._id === resumeId);
      if (foundDummy) {
        setResume(foundDummy);
      }
      setLoading(false);
    };

    fetchResume();
  }, [resumeId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="size-10 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Resume Not Found</h1>
        <p className="text-slate-500 text-sm">The requested resume does not exist or is private.</p>
        <Link to="/resume">
          <Button variant="emeraldGradient" size="md">
            Return to Resume Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 print:p-0 print:bg-white">
      {/* Top Controls */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link to="/resume">
          <Button variant="outline" size="sm">
            <ArrowLeft className="size-4" /> Back to Dashboard
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">{resume.title}</span>
          <Button variant="emeraldGradient" size="sm" onClick={() => window.print()}>
            <Download className="size-4" /> Download / Print PDF
          </Button>
        </div>
      </div>

      {/* Resume Document Wrapper */}
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden print:shadow-none print:rounded-none">
        <ResumePreview data={resume} template={resume.template} accentColor={resume.accentColor || resume.accent_color} />
      </div>
    </div>
  );
}
