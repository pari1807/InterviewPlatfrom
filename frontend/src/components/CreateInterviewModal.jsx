import React, { useState } from "react";
import { PROBLEMS } from "../data/problems";
import { Code2, Loader2, Plus, X, Sparkles, UserCheck, ShieldCheck } from "lucide-react";
import { Button } from "./ui/Button";
import { Badge, getDifficultyBadgeVariant } from "./ui/Badge";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export default function CreateInterviewModal({
  isOpen,
  onClose,
  initialCandidateId = "",
  onInterviewCreated,
}) {
  const problems = Object.values(PROBLEMS);
  const [candidateId, setCandidateId] = useState(initialCandidateId);
  const [problemTitle, setProblemTitle] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!candidateId.trim() || !problemTitle) {
      toast.error("Please enter a Candidate ID and select a problem statement");
      return;
    }

    setIsCreating(true);

    try {
      const res = await axios.post("/interviews/create", {
        candidateId: candidateId.trim(),
        problem: problemTitle,
        difficulty,
        durationMinutes,
      });

      toast.success(res.data.message || "Interview created successfully!");
      if (onInterviewCreated) onInterviewCreated(res.data.session);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create interview session");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 relative overflow-hidden space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900">Schedule Candidate Interview</h3>
              <p className="text-xs text-slate-500">Create a 1-on-1 session linked directly to Candidate ID</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          {/* Candidate ID Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Candidate ID <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <UserCheck className="absolute left-3.5 top-3 size-4 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. CAND-8X2P91..."
                value={candidateId}
                onChange={(e) => setCandidateId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-mono text-slate-800 focus:outline-none focus:border-emerald-500 uppercase transition-all"
              />
            </div>
          </div>

          {/* Problem Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Select Problem Statement <span className="text-rose-500">*</span>
            </label>
            <select
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
              value={problemTitle}
              onChange={(e) => {
                const selected = problems.find((p) => p.title === e.target.value);
                setProblemTitle(e.target.value);
                if (selected) setDifficulty(selected.difficulty.toLowerCase());
              }}
            >
              <option value="" disabled>
                Choose coding problem...
              </option>
              {problems.map((prob) => (
                <option key={prob.id} value={prob.title}>
                  {prob.title} ({prob.difficulty}) - {prob.category}
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Duration (Minutes)
            </label>
            <select
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
            >
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes (Standard)</option>
              <option value={60}>60 Minutes (Deep Dive)</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isCreating}>
            Cancel
          </Button>

          <Button
            variant="emeraldGradient"
            onClick={handleSubmit}
            disabled={isCreating || !candidateId.trim() || !problemTitle}
          >
            {isCreating ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Creating Session...</span>
              </>
            ) : (
              <>
                <Plus className="size-4" />
                <span>Schedule Interview</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
