import React from "react";
import { PROBLEMS } from "../data/problems";
import { Code2, Loader2, Plus, X, Sparkles } from "lucide-react";
import { Button } from "./ui/Button";
import { Badge, getDifficultyBadgeVariant } from "./ui/Badge";

export default function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const problems = Object.values(PROBLEMS);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900">Create Live Interview Room</h3>
              <p className="text-xs text-slate-500">Host a 1-on-1 collaborative practice session</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Select Problem Statement <span className="text-rose-500">*</span>
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer"
              value={roomConfig.problem}
              onChange={(e) => {
                const selectedProblem = problems.find((p) => p.title === e.target.value);
                setRoomConfig({
                  difficulty: selectedProblem.difficulty,
                  problem: e.target.value,
                });
              }}
            >
              <option value="" disabled>
                Choose a coding challenge...
              </option>
              {problems.map((problem) => (
                <option key={problem.id} value={problem.title}>
                  {problem.title} ({problem.difficulty}) - {problem.category}
                </option>
              ))}
            </select>
          </div>

          {/* Room Summary Preview */}
          {roomConfig.problem && (
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 mt-0.5">
                <Code2 className="size-4" />
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-bold text-emerald-900 text-sm">Room Configuration</p>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-medium">Problem:</span>
                  <span className="font-semibold text-slate-900">{roomConfig.problem}</span>
                  <Badge variant={getDifficultyBadgeVariant(roomConfig.difficulty)} size="sm">
                    {roomConfig.difficulty}
                  </Badge>
                </div>
                <p className="text-emerald-700/80">Capacity: 2 Candidates (1-on-1 Real-time Pair Programming)</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isCreating}>
            Cancel
          </Button>

          <Button
            variant="emeraldGradient"
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem}
          >
            {isCreating ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Creating Room...</span>
              </>
            ) : (
              <>
                <Plus className="size-4" />
                <span>Create Session</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
