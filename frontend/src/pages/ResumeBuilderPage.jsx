import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { AppLayout } from "../components/layout/AppLayout";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { resumeApi } from "../services/resumeApi";
import { dummyResumeData } from "../modules/resume/assets/assets";
import toast from "react-hot-toast";

import AchievementForm from "../modules/resume/components/AchievementForm";
import ActivityForm from "../modules/resume/components/ActivityForm";
import CertificationForm from "../modules/resume/components/CertificationForm";
import ColorPicker from "../modules/resume/components/ColorPicker";
import EducationForm from "../modules/resume/components/EducationForm";
import ExperienceForm from "../modules/resume/components/ExperienceForm";
import PersonInfo from "../modules/resume/components/PersonInfo";
import ProfessionalSummaryForm from "../modules/resume/components/ProfessionalSummaryForm";
import ProjectForm from "../modules/resume/components/ProjectForm";
import ResumePreview from "../modules/resume/components/ResumePreview";
import SkillForm from "../modules/resume/components/SkillForm";
import TemplateSelector from "../modules/resume/components/TemplateSelector";
import { DEFAULT_LAYOUT_SETTINGS } from "../modules/resume/components/templates/templateUtils";

import {
  ArrowLeftIcon,
  Award,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  FileText,
  FolderIcon,
  GraduationCap,
  Share2,
  Sparkles,
  Trophy,
  User,
  Users,
  Save,
  Loader2,
} from "lucide-react";

const buildEmptyResume = (resumeId = "") => ({
  _id: resumeId,
  title: "",
  personal_info: {},
  professional_summary: "",
  experience: [],
  project: [],
  education: [],
  skills: [],
  certifications: [],
  achievements: [],
  extracurricular_activities: [],
  template: "classic",
  accentColor: "#10b981",
  public: false,
});

const normalizeResumeData = (resume = {}) => ({
  ...buildEmptyResume(resume._id || ""),
  ...resume,
  personal_info: resume.personal_info || {},
  professional_summary: resume.professional_summary || "",
  experience: resume.experience || [],
  project: resume.project || resume.projects || [],
  education: resume.education || [],
  skills: resume.skills || [],
  certifications: resume.certifications || resume.certificates || [],
  achievements: resume.achievements || [],
  extracurricular_activities: resume.extracurricular_activities || resume.extracurricularActivities || resume.activities || [],
  template: resume.template || "classic",
  accentColor: resume.accentColor || resume.accent_color || "#10b981",
  public: Boolean(resume.public),
});

export default function ResumeBuilderPage() {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const [resumeData, setResumeData] = useState(() => buildEmptyResume(resumeId));
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const sections = [
    { id: "personal_info", name: "Personal Information", icon: User },
    { id: "professional_summary", name: "Professional Summary", icon: FileText },
    { id: "experience", name: "Work Experience", icon: Briefcase },
    { id: "project", name: "Projects", icon: FolderIcon },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "skills", name: "Skills", icon: Sparkles },
    { id: "certifications", name: "Certifications", icon: Award },
    { id: "achievements", name: "Achievements", icon: Trophy },
    { id: "extracurricular_activities", name: "Extracurriculars", icon: Users },
  ];

  const activeSection = sections[activeSectionIndex];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadResume = async () => {
      // Check database first
      if (resumeId && !resumeId.startsWith("resume-")) {
        try {
          const res = await resumeApi.getResumeById(resumeId);
          if (isMounted && res && res.resume) {
            setResumeData(normalizeResumeData(res.resume));
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn("Backend resume load failed:", err.message);
        }
      }

      // Check localStorage draft
      const draftKey = `resume-builder:draft:${resumeId}`;
      const storedDraft = localStorage.getItem(draftKey);
      if (storedDraft) {
        try {
          const parsed = JSON.parse(storedDraft);
          if (isMounted && parsed) {
            setResumeData(normalizeResumeData(parsed));
            setLoading(false);
            return;
          }
        } catch (e) {}
      }

      // Check dummy data fallback
      const foundDummy = dummyResumeData.find((r) => r._id === resumeId);
      if (foundDummy && isMounted) {
        setResumeData(normalizeResumeData(foundDummy));
        setLoading(false);
        return;
      }

      if (isMounted) {
        setResumeData(buildEmptyResume(resumeId));
        setLoading(false);
      }
    };

    loadResume();
    return () => {
      isMounted = false;
    };
  }, [resumeId]);

  const updateResumeData = (sectionId, value) => {
    setResumeData((prev) => {
      const updated = { ...prev, [sectionId]: value };
      if (prev._id) {
        localStorage.setItem(`resume-builder:draft:${prev._id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (resumeData._id && !resumeData._id.startsWith("resume-")) {
        const formData = new FormData();
        formData.append("resumeId", resumeData._id);
        formData.append("resumeData", JSON.stringify(resumeData));
        formData.append("removeBackground", removeBackground ? "true" : "false");
        await resumeApi.updateResume(formData);
        toast.success("Resume saved successfully!");
      } else {
        const res = await resumeApi.createResume(resumeData);
        if (res && res.resume) {
          toast.success("Resume created in database!");
          navigate(`/resume/builder/${res.resume._id}`, { replace: true });
        }
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error(err.message || "Failed to save resume");
    } finally {
      setSaving(false);
    }
  };

  const activeFormComponent = useMemo(() => {
    switch (activeSection.id) {
      case "personal_info":
        return (
          <PersonInfo
            data={resumeData.personal_info}
            onChange={(val) => updateResumeData("personal_info", val)}
            removeBackground={removeBackground}
            setRemoveBackground={setRemoveBackground}
          />
        );
      case "professional_summary":
        return (
          <ProfessionalSummaryForm
            data={resumeData.professional_summary}
            onChange={(val) => updateResumeData("professional_summary", val)}
          />
        );
      case "experience":
        return (
          <ExperienceForm
            data={resumeData.experience}
            onChange={(val) => updateResumeData("experience", val)}
          />
        );
      case "project":
        return (
          <ProjectForm
            data={resumeData.project}
            onChange={(val) => updateResumeData("project", val)}
          />
        );
      case "education":
        return (
          <EducationForm
            data={resumeData.education}
            onChange={(val) => updateResumeData("education", val)}
          />
        );
      case "skills":
        return (
          <SkillForm
            data={resumeData.skills}
            onChange={(val) => updateResumeData("skills", val)}
          />
        );
      case "certifications":
        return (
          <CertificationForm
            data={resumeData.certifications}
            onChange={(val) => updateResumeData("certifications", val)}
          />
        );
      case "achievements":
        return (
          <AchievementForm
            data={resumeData.achievements}
            onChange={(val) => updateResumeData("achievements", val)}
          />
        );
      case "extracurricular_activities":
        return (
          <ActivityForm
            data={resumeData.extracurricular_activities}
            onChange={(val) => updateResumeData("extracurricular_activities", val)}
          />
        );
      default:
        return null;
    }
  }, [activeSection.id, resumeData, removeBackground]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="size-10 text-emerald-600 animate-spin" />
          <p className="mt-4 text-sm font-semibold text-slate-600">Loading Resume Builder...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate("/resume")}>
              <ArrowLeftIcon className="size-4" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 truncate max-w-md">
                {resumeData.title || "Untitled Resume"}
              </h1>
              <p className="text-xs text-slate-500">Live Editor & Preview</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <TemplateSelector
              selectedTemplate={resumeData.template}
              onChange={(tpl) => updateResumeData("template", tpl)}
            />
            <ColorPicker
              selectedColor={resumeData.accentColor}
              onChange={(color) => updateResumeData("accentColor", color)}
            />

            <Button variant="emeraldGradient" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              <span>Save Resume</span>
            </Button>

            {resumeData._id && (
              <Link to={`/resume/view/${resumeData._id}`} target="_blank">
                <Button variant="outline" size="sm">
                  <Download className="size-4 text-emerald-600" />
                  <span>Preview & Export</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Builder Split Layout */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Left Form Panel */}
          <div className="lg:col-span-5 space-y-6">
            {/* Section Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {sections.map((section, idx) => {
                const Icon = section.icon;
                const isActive = idx === activeSectionIndex;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSectionIndex(idx)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Icon className="size-3.5" />
                    <span>{section.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Form Card */}
            <Card className="p-6 bg-white border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  {React.createElement(activeSection.icon, { className: "size-5 text-emerald-600" })}
                  <span>{activeSection.name}</span>
                </h2>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveSectionIndex((prev) => Math.max(0, prev - 1))}
                    disabled={activeSectionIndex === 0}
                    className="p-1.5 rounded-lg border text-slate-500 disabled:opacity-30 hover:bg-slate-100 cursor-pointer"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    onClick={() => setActiveSectionIndex((prev) => Math.min(sections.length - 1, prev + 1))}
                    disabled={activeSectionIndex === sections.length - 1}
                    className="p-1.5 rounded-lg border text-slate-500 disabled:opacity-30 hover:bg-slate-100 cursor-pointer"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {activeFormComponent}
            </Card>
          </div>

          {/* Right Live Preview Panel */}
          <div className="lg:col-span-7 sticky top-6">
            <Card className="p-4 bg-slate-900 border border-slate-800 shadow-xl overflow-hidden rounded-2xl">
              {/* Preview Control Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 mb-3 px-2 pb-2 border-b border-slate-800">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Eye className="size-4" /> Live A4 Preview
                </span>
                
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">Template: <strong className="text-white capitalize">{resumeData.template || "classic"}</strong></span>
                  <div className="h-4 w-px bg-slate-700" />
                  <span className="text-[11px] text-slate-400">Scale: <strong className="text-emerald-400">Full Width A4</strong></span>
                </div>
              </div>

              {/* Scrollable A4 Document View */}
              <div className="bg-slate-950 rounded-xl shadow-inner max-h-[82vh] overflow-y-auto p-4 flex justify-center">
                <div className="w-full max-w-[800px] shadow-2xl transition-all">
                  <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accentColor} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
