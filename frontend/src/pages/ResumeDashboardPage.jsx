import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { AppLayout } from "../components/layout/AppLayout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { useDbUser } from "../context/UserContext";
import { resumeApi } from "../services/resumeApi";
import { dummyResumeData } from "../modules/resume/assets/assets";
import pdfToText from "react-pdftotext";
import toast from "react-hot-toast";
import {
  FilePenIcon,
  PlusIcon,
  UploadCloudIcon,
  TrashIcon,
  PencilIcon,
  XIcon,
  Loader2,
  Sparkles,
  FileText,
  Clock,
  ExternalLink,
  Copy,
  BookOpen,
} from "lucide-react";

export default function ResumeDashboardPage() {
  const colors = [
    { bg: "bg-emerald-50/80", text: "text-emerald-600", border: "border-emerald-200" },
    { bg: "bg-teal-50/80", text: "text-teal-600", border: "border-teal-200" },
    { bg: "bg-indigo-50/80", text: "text-indigo-600", border: "border-indigo-200" },
    { bg: "bg-purple-50/80", text: "text-purple-600", border: "border-purple-200" },
    { bg: "bg-sky-50/80", text: "text-sky-600", border: "border-sky-200" },
  ];

  const [dbResumes, setDbResumes] = useState([]);
  const { dbUser } = useDbUser();
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [editResumeId, setEditResumeId] = useState("");
  const [showEditTitle, setShowEditTitle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const navigate = useNavigate();

  // Exactly 3 default reference CVs
  const referenceTemplates = dummyResumeData.slice(0, 3);

  const loadAllResumes = async () => {
    setFetching(true);
    let userBackendResumes = [];
    try {
      const data = await resumeApi.getAllResumes();
      if (data && data.resumes) {
        userBackendResumes = data.resumes;
      }
    } catch (err) {
      console.warn("Failed to load resumes from backend:", err.message);
    }

    setDbResumes(userBackendResumes);
    setFetching(false);
  };

  const deleteResume = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume? This cannot be undone.")) return;
    try {
      await resumeApi.deleteResume(id);
      localStorage.removeItem(`resume-builder:draft:${id}`);
      setDbResumes((prev) => prev.filter((r) => r._id !== id));
      toast.success("Resume deleted from database");
    } catch (err) {
      console.error("Delete resume error:", err);
      toast.error(err.message || "Failed to delete resume");
    }
  };

  const updateResumeTitle = async (e) => {
    e.preventDefault();
    const resumeToEdit = dbResumes.find((r) => r._id === editResumeId);
    if (!resumeToEdit) return;

    try {
      const formData = new FormData();
      formData.append("resumeId", editResumeId);
      formData.append("resumeData", JSON.stringify({ ...resumeToEdit, title }));
      await resumeApi.updateResume(formData);
      setDbResumes((prev) => prev.map((r) => (r._id === editResumeId ? { ...r, title } : r)));
      toast.success("Resume title updated");
    } catch (err) {
      console.error("Failed to update resume title on DB:", err);
      toast.error(err.message || "Failed to update title");
    } finally {
      setShowEditTitle(false);
      setEditResumeId("");
      setTitle("");
    }
  };

  const handleEditClick = (e, resume) => {
    e.stopPropagation();
    setEditResumeId(resume._id);
    setTitle(resume.title);
    setShowEditTitle(true);
  };

  const createResume = async (event) => {
    event.preventDefault();
    setShowCreateResume(false);

    const newResumeData = {
      title: title || "Untitled Resume",
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
    };

    try {
      setLoading(true);
      const data = await resumeApi.createResume(newResumeData);
      if (data && data.resume) {
        setTitle("");
        setLoading(false);
        toast.success("Resume created & synced with database!");
        navigate(`/resume/builder/${data.resume._id}`);
        return;
      }
    } catch (err) {
      console.error("Failed to create resume on DB:", err);
      toast.error(err.message || "Failed to create resume");
    } finally {
      setLoading(false);
    }
  };

  const cloneReferenceTemplate = async (template) => {
    try {
      setLoading(true);
      const cloneData = {
        ...template,
        _id: undefined,
        title: `${template.personal_info?.full_name || 'Sample'} - Copy`,
      };
      const res = await resumeApi.createResume(cloneData);
      if (res && res.resume) {
        toast.success("Sample template cloned to your account!");
        navigate(`/resume/builder/${res.resume._id}`);
      }
    } catch (err) {
      console.error("Failed to clone reference template:", err);
      toast.error(err.message || "Failed to clone template");
    } finally {
      setLoading(false);
    }
  };

  const uploadResume = async (event) => {
    event.preventDefault();
    if (!resumeFile) {
      toast.error("Please select a PDF or JSON file first.");
      return;
    }

    setShowUploadResume(false);
    setLoading(true);

    try {
      if (resumeFile.name.endsWith(".json")) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const imported = JSON.parse(e.target.result);
            const data = await resumeApi.createResume(imported);
            if (data && data.resume) {
              toast.success("Resume imported & saved to database!");
              setLoading(false);
              navigate(`/resume/builder/${data.resume._id}`);
            }
          } catch (err) {
            toast.error("Invalid JSON resume format.");
            setLoading(false);
          }
        };
        reader.readAsText(resumeFile);
      } else if (resumeFile.name.endsWith(".pdf")) {
        try {
          const text = await pdfToText(resumeFile);
          const response = await fetch("http://localhost:3000/api/resume-ai/upload-resume", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              resumeText: text,
              title: resumeFile.name.replace(".pdf", ""),
            }),
          });

          const data = await response.json();
          if (data && data.resumeId) {
            toast.success("Resume extracted by Gemini AI & saved!");
            setLoading(false);
            navigate(`/resume/builder/${data.resumeId}`);
          } else {
            const fallbackRes = await resumeApi.createResume({
              title: resumeFile.name.replace(".pdf", ""),
              professional_summary: text.slice(0, 500),
            });
            if (fallbackRes && fallbackRes.resume) {
              toast.success("Resume text parsed & saved!");
              setLoading(false);
              navigate(`/resume/builder/${fallbackRes.resume._id}`);
            }
          }
        } catch (err) {
          console.error("PDF upload error:", err);
          toast.error(err.message || "Failed to extract resume details");
          setLoading(false);
        }
      } else {
        toast.error("Unsupported file type. Please upload a PDF or JSON file.");
        setLoading(false);
      }
    } catch (err) {
      toast.error(err.message || "Upload failed");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllResumes();
  }, []);

  return (
    <AppLayout>
      {loading && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-emerald-600 animate-spin"></div>
          <p className="mt-6 text-lg font-bold text-white uppercase tracking-widest animate-pulse">Syncing with Database...</p>
        </div>
      )}

      <div className="space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge variant="emerald" size="sm" className="mb-2">
              <Sparkles className="size-3.5" />
              <span>AI Resume Builder</span>
            </Badge>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Resume <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Dashboard</span>
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              All resumes in your account are synced live with MongoDB.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="md" onClick={() => setShowUploadResume(true)}>
              <UploadCloudIcon className="size-4 text-emerald-600" />
              <span>Import PDF/JSON</span>
            </Button>
            <Button variant="emeraldGradient" size="md" onClick={() => setShowCreateResume(true)}>
              <PlusIcon className="size-4" />
              <span>Create Resume</span>
            </Button>
          </div>
        </div>

        {/* Section 1: User's Account Saved Database Resumes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="size-5 text-emerald-600" />
              <span>Your Account Resumes ({dbResumes.length})</span>
            </h2>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              MongoDB Synced
            </span>
          </div>

          {fetching ? (
            <div className="flex justify-center py-12">
              <Loader2 className="size-8 text-emerald-600 animate-spin" />
            </div>
          ) : dbResumes.length === 0 ? (
            <Card className="p-10 text-center space-y-4 bg-slate-50/50 border border-dashed border-slate-300">
              <FileText className="size-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Saved Account Resumes Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create a new resume or use one of the 3 reference templates below to save a CV to your account.
              </p>
              <Button variant="emeraldGradient" size="sm" onClick={() => setShowCreateResume(true)}>
                <PlusIcon className="size-4" />
                <span>Create Your First CV</span>
              </Button>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {dbResumes.map((resume, index) => {
                const color = colors[index % colors.length];
                return (
                  <Card
                    key={resume._id}
                    onClick={() => navigate(`/resume/builder/${resume._id}`)}
                    className="group relative overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300 border border-slate-200/80 hover:shadow-lg bg-white"
                  >
                    <div className={`h-36 ${color.bg} flex items-center justify-center relative`}>
                      <FilePenIcon className={`size-14 ${color.text} opacity-40 group-hover:scale-110 transition-transform`} />

                      <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button
                          onClick={(e) => handleEditClick(e, resume)}
                          className="p-2 bg-white shadow text-slate-600 hover:text-emerald-600 rounded-xl transition cursor-pointer"
                          title="Rename Title"
                        >
                          <PencilIcon className="size-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteResume(resume._id);
                          }}
                          className="p-2 bg-white shadow text-slate-600 hover:text-red-600 rounded-xl transition cursor-pointer"
                          title="Delete Resume"
                        >
                          <TrashIcon className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 space-y-2 bg-white">
                      <h3 className="font-bold text-slate-900 text-sm truncate" title={resume.title}>
                        {resume.title || "Untitled Resume"}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3 text-slate-400" />
                          {new Date(resume.updatedAt || Date.now()).toLocaleDateString([], { month: "short", day: "numeric" })}
                        </span>
                        <Badge variant="outline" size="sm">
                          {resume.template || "classic"}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 2: Default 3 Reference CV Templates */}
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="size-5 text-indigo-600" />
                <span>Reference Sample Templates (3 Default CVs)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any sample template to clone it directly into your database account.
              </p>
            </div>
            <Badge variant="indigo" size="sm">
              3 Sample References
            </Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {referenceTemplates.map((template, idx) => (
              <Card
                key={template._id || idx}
                className="p-5 bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="indigo" size="sm">
                      Reference Template {idx + 1}
                    </Badge>
                    <span className="text-[11px] text-slate-400 capitalize">{template.template}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {template.personal_info?.full_name || template.title}
                    </h3>
                    <p className="text-xs font-medium text-indigo-600">
                      {template.personal_info?.profession || "Sample Resume"}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {template.professional_summary}
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    onClick={() => cloneReferenceTemplate(template)}
                  >
                    <Copy className="size-3.5" />
                    <span>Use & Save to Account</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Create Modal */}
        {showCreateResume && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-6 space-y-6 bg-white animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="font-bold text-lg text-slate-900">Create New Resume</h3>
                <button onClick={() => setShowCreateResume(false)} className="text-slate-400 hover:text-slate-600">
                  <XIcon className="size-5" />
                </button>
              </div>

              <form onSubmit={createResume} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Resume Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Fullstack Developer 2026"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 text-sm"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="md" type="button" onClick={() => setShowCreateResume(false)}>
                    Cancel
                  </Button>
                  <Button variant="emeraldGradient" size="md" type="submit">
                    Create Resume
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadResume && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-6 space-y-6 bg-white animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="font-bold text-lg text-slate-900">Import Resume (PDF / JSON)</h3>
                <button onClick={() => setShowUploadResume(false)} className="text-slate-400 hover:text-slate-600">
                  <XIcon className="size-5" />
                </button>
              </div>

              <form onSubmit={uploadResume} className="space-y-4">
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-emerald-400 transition-colors">
                  <UploadCloudIcon className="size-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 mb-1 font-medium">Click to choose a file</p>
                  <input
                    type="file"
                    accept=".pdf,.json"
                    onChange={(e) => setResumeFile(e.target.files?.[0])}
                    className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="md" type="button" onClick={() => setShowUploadResume(false)}>
                    Cancel
                  </Button>
                  <Button variant="emeraldGradient" size="md" type="submit">
                    Upload & Extract
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Rename Modal */}
        {showEditTitle && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-6 space-y-6 bg-white animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="font-bold text-lg text-slate-900">Rename Resume</h3>
                <button onClick={() => setShowEditTitle(false)} className="text-slate-400 hover:text-slate-600">
                  <XIcon className="size-5" />
                </button>
              </div>

              <form onSubmit={updateResumeTitle} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">New Resume Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 text-sm"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="md" type="button" onClick={() => setShowEditTitle(false)}>
                    Cancel
                  </Button>
                  <Button variant="emeraldGradient" size="md" type="submit">
                    Update Title
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
