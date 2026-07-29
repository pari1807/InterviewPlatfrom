import React, { useState, useEffect } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { resumeApi } from "../services/resumeApi";
import { atsApi } from "../services/atsApi";
import toast from "react-hot-toast";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  TrendingUp,
  FileText,
  Briefcase,
  AlertTriangle,
  Loader2,
  Award,
} from "lucide-react";

export default function ATSAnalysisPage() {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchResumes = async () => {
      setLoadingResumes(true);
      try {
        const data = await resumeApi.getAllResumes();
        if (data && data.resumes) {
          setResumes(data.resumes);
          if (data.resumes.length > 0) {
            setSelectedResumeId(data.resumes[0]._id);
          }
        }
      } catch (err) {
        console.warn("Failed to load user resumes:", err);
      } finally {
        setLoadingResumes(false);
      }
    };

    fetchResumes();
  }, []);

  const handleRunAnalysis = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description.");
      return;
    }

    setAnalyzing(true);
    setReport(null);

    try {
      const selectedResume = resumes.find((r) => r._id === selectedResumeId);
      const res = await atsApi.analyzeATS({
        resumeId: selectedResumeId || undefined,
        resumeContent: selectedResume ? JSON.stringify(selectedResume) : undefined,
        jobTitle,
        jobDescription,
      });

      if (res && res.report) {
        setReport(res.report);
        toast.success("ATS Analysis completed!");
      }
    } catch (err) {
      console.error("ATS Analysis error:", err);
      toast.error(err.message || "Failed to generate ATS Analysis");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div>
          <Badge variant="emerald" size="sm" className="mb-2">
            <Sparkles className="size-3.5" />
            <span>AI ATS Optimization</span>
          </Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            ATS Resume <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Scanner & Matcher</span>
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Audit your resume against job descriptions to score keyword alignment, formatting, and overall pass rate before applying.
          </p>
        </div>

        {/* Scanner Form Split */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Input Form */}
          <Card className="lg:col-span-5 p-6 bg-white border border-slate-200 space-y-5">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b pb-3">
              <FileText className="size-4 text-emerald-600" />
              <span>Target Analysis Inputs</span>
            </h2>

            <form onSubmit={handleRunAnalysis} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Saved Resume</label>
                {loadingResumes ? (
                  <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                    <Loader2 className="size-3.5 animate-spin" /> Loading resumes...
                  </div>
                ) : resumes.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No saved resumes found. Create one first or paste below.</p>
                ) : (
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-emerald-500 bg-slate-50"
                  >
                    {resumes.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.title || "Untitled Resume"} ({new Date(r.updatedAt).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Job Title (Optional)</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Job Description (Required)</label>
                <textarea
                  rows={8}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description or key requirements here..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500 resize-none"
                  required
                />
              </div>

              <Button
                variant="emeraldGradient"
                size="md"
                type="submit"
                className="w-full justify-center"
                disabled={analyzing}
              >
                {analyzing ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Auditing with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    <span>Analyze ATS Match</span>
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Results Output */}
          <div className="lg:col-span-7">
            {!report && !analyzing && (
              <Card className="p-12 text-center space-y-4 border border-dashed border-slate-300">
                <Award className="size-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">Ready for ATS Audit</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Select a resume, paste the target job description, and click "Analyze ATS Match" to generate your detailed report.
                </p>
              </Card>
            )}

            {analyzing && (
              <Card className="p-12 text-center space-y-4 border border-emerald-200">
                <Loader2 className="size-10 text-emerald-600 animate-spin mx-auto" />
                <h3 className="text-base font-bold text-slate-900 animate-pulse">Gemini AI is Auditing Your Resume</h3>
                <p className="text-xs text-slate-500">Checking keyword density, formatting, and role alignment...</p>
              </Card>
            )}

            {report && (
              <div className="space-y-6">
                {/* Score Card */}
                <Card className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-emerald-100 uppercase tracking-widest font-semibold">ATS Compatibility Score</p>
                      <h2 className="text-4xl font-extrabold mt-1">{report.matchScore}%</h2>
                    </div>
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur">
                      <TrendingUp className="size-8 text-white" />
                    </div>
                  </div>

                  <p className="text-xs text-emerald-50/90 leading-relaxed border-t border-white/20 pt-3">
                    {report.overallAssessment}
                  </p>
                </Card>

                {/* Keywords Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Matched Keywords */}
                  <Card className="p-5 border border-emerald-200 bg-emerald-50/30 space-y-3">
                    <h4 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      <span>Matched Keywords ({report.matchedKeywords?.length || 0})</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {report.matchedKeywords?.map((kw, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-medium">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </Card>

                  {/* Missing Keywords */}
                  <Card className="p-5 border border-amber-200 bg-amber-50/30 space-y-3">
                    <h4 className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                      <XCircle className="size-4 text-amber-600" />
                      <span>Missing Keywords ({report.missingKeywords?.length || 0})</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {report.missingKeywords?.map((kw, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-[11px] font-medium">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Actionable Recommendations */}
                <Card className="p-6 bg-white space-y-4 border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Sparkles className="size-4 text-emerald-600" />
                    <span>Actionable Improvements</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {report.improvements?.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <AlertTriangle className="size-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
