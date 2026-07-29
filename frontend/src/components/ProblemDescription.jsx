import React from "react";
import { Badge, getDifficultyBadgeVariant } from "./ui/Badge";
import { BookOpen, CheckCircle2, Code2, Layers } from "lucide-react";

export default function ProblemDescription({
  problem,
  currentProblemId,
  onProblemChange,
  allProblems,
}) {
  return (
    <div className="h-full overflow-y-auto bg-slate-50 border-r border-slate-200/80 flex flex-col">
      {/* Header section */}
      <div className="p-5 bg-white border-b border-slate-200/80 sticky top-0 z-10">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{problem.title}</h1>
          <Badge variant={getDifficultyBadgeVariant(problem.difficulty)}>{problem.difficulty}</Badge>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-3">
          <Layers className="size-3.5 text-emerald-600" />
          <span>{problem.category}</span>
        </div>

        {/* Problem selector */}
        <select
          className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
          value={currentProblemId}
          onChange={(e) => onProblemChange(e.target.value)}
        >
          {allProblems.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} ({p.difficulty})
            </option>
          ))}
        </select>
      </div>

      {/* Body description */}
      <div className="p-5 space-y-6 flex-1 text-slate-800">
        {/* Statement */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Problem Description
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            {problem.description?.text}
          </p>
          {problem.description?.notes?.map((note, idx) => (
            <p key={idx} className="text-xs text-slate-600 italic">
              {note}
            </p>
          ))}
        </div>

        {/* Examples */}
        {problem.examples && problem.examples.length > 0 && (
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Test Examples
            </h2>
            <div className="space-y-3">
              {problem.examples.map((example, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 font-mono text-xs space-y-1.5">
                  <div className="text-slate-500 text-[11px] font-sans font-bold mb-1">
                    Example {idx + 1}:
                  </div>
                  <div className="flex gap-2 text-slate-800">
                    <span className="text-emerald-700 font-bold min-w-[55px]">Input:</span>
                    <span className="text-slate-900 font-medium">{example.input}</span>
                  </div>
                  <div className="flex gap-2 text-slate-800">
                    <span className="text-teal-700 font-bold min-w-[55px]">Output:</span>
                    <span className="text-slate-900 font-medium">{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div className="pt-1.5 border-t border-slate-200 text-[11px] font-sans text-slate-500">
                      <span className="font-semibold">Note:</span> {example.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Constraints */}
        {problem.constraints && problem.constraints.length > 0 && (
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Constraints
            </h2>
            <ul className="space-y-2 text-xs font-mono text-slate-700">
              {problem.constraints.map((constraint, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <code>{constraint}</code>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
