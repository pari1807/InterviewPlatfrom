import React, { useState } from "react";
import { Sparkles, Loader2, CheckCircle2, HelpCircle, AlertTriangle, BookOpen } from "lucide-react";
import { Button } from "./ui/Button";
import { Card, CardHeader, CardBody } from "./ui/Card";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export default function HostRubricAssistant({ sessionId, problemTitle, difficulty }) {
  const [rawNotes, setRawNotes] = useState("");
  const [isExpanding, setIsExpanding] = useState(false);
  const [rubric, setRubric] = useState(null);

  const handleExpandNotes = async () => {
    if (!rawNotes.trim()) {
      toast.error("Please enter brief notes first");
      return;
    }

    setIsExpanding(true);
    try {
      const res = await axios.post("/ai/expand-rubric", {
        sessionId,
        rawNotes,
        problemTitle,
        difficulty,
      });

      setRubric(res.data.rubric);
      toast.success("AI expanded evaluation rubric generated!");
    } catch (err) {
      toast.error("Failed to generate rubric");
    } finally {
      setIsExpanding(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Host AI Rubric Assistant</h3>
            <p className="text-xs text-slate-500">Enter quick notes to automatically expand into a detailed evaluation guide</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          value={rawNotes}
          onChange={(e) => setRawNotes(e.target.value)}
          placeholder="e.g. hash map O(N) solution, check empty array, ask about collisions, evaluate trade-offs..."
          className="w-full h-24 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-emerald-500 transition-all font-mono"
        />

        <div className="flex justify-end">
          <Button
            variant="emeraldGradient"
            size="sm"
            onClick={handleExpandNotes}
            disabled={isExpanding || !rawNotes.trim()}
          >
            {isExpanding ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Expanding Rubric...</span>
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                <span>Expand Notes with AI</span>
              </>
            )}
          </Button>
        </div>

        {rubric && (
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-4 text-xs animate-fade-in">
            {/* Explanation & Approach */}
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
              <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
                <BookOpen className="size-4 text-emerald-600" />
                Expected Optimal Approach
              </h4>
              <p className="text-slate-700 leading-relaxed font-medium">{rubric.expectedApproach}</p>
            </div>

            {/* Rubric Criteria */}
            {rubric.evaluationRubric && (
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Evaluation Rubric Criteria</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                    <span className="font-bold block mb-1">Excellent:</span>
                    <p className="text-[11px] leading-tight">{rubric.evaluationRubric.excellent}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
                    <span className="font-bold block mb-1">Acceptable:</span>
                    <p className="text-[11px] leading-tight">{rubric.evaluationRubric.acceptable}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
                    <span className="font-bold block mb-1">Needs Improvement:</span>
                    <p className="text-[11px] leading-tight">{rubric.evaluationRubric.needsImprovement}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Follow-up Questions & Hints */}
            {rubric.followUpQuestions && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <HelpCircle className="size-4 text-emerald-600" />
                  Recommended Follow-Up Questions
                </h4>
                <ul className="space-y-1 text-slate-700 pl-4 list-disc">
                  {rubric.followUpQuestions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
