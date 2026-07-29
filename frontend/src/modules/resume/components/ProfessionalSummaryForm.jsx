// =====================================================
// AI-CHANGE
// Date: 2026-07-20
// Reason: Connect the AI Enhance button to the backend professional summary enhancer with interactive loading states.
// Changes: Implemented handleEnhance with interval-based dynamic texts and Axios client integration. Added Sparkles/Loader2 and api imports.
// Connected Files: client/src/configs/api.js, server/routes/aiRoutes.js
// =====================================================
import { Sparkles, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import apiClient from '../../../services/apiClient'

const ProfessionalSummaryForm = ({data, onChange}) => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Enhancing...");

  const handleEnhance = async () => {
    if (!data || !data.trim()) {
      alert("Please write a draft first so AI can suggest enhancements.");
      return;
    }

    setLoading(true);
    setLoadingText("Analyzing text...");
    try {
      const texts = ["Polishing language...", "Optimizing for ATS...", "Crafting structure..."];
      let textIdx = 0;
      const interval = setInterval(() => {
        setLoadingText(texts[textIdx % texts.length]);
        textIdx++;
      }, 1500);

      const response = await apiClient.post("/resume-ai/enhance-pro-sum", { userContent: data });
      clearInterval(interval);
      if (response.data && response.data.enhancedContent) {
        onChange(response.data.enhancedContent.trim());
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || error.message || "Failed to enhance summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
        <div className = 'flex items-center justify-between gap-3'>
            <div>
                <h3 className = 'text-lg font-semibold text-slate-900'>
                    Professional Summary
                </h3>
                <p className = 'text-sm text-slate-500'>
                    Add Summary for your resume here 
                </p>
            </div>

            <button
              type="button"
              onClick={handleEnhance}
              disabled={loading}
              className = 'flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50 cursor-pointer'
            >
                {loading ? (
                  <>
                    <Loader2 className ='size-4 animate-spin' />
                    <span>{loadingText}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className ='size-4' />
                    <span>AI Enhance</span>
                  </>
                )}
            </button>
        </div>

        <div className ='mt-6'>
            <textarea value = {data || ""}  onChange = {(e) => onChange(e.target.value)} rows = {6} className = 'mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100' placeholder='Write a concise professional summary that highlights your key strengths and career objectives...'/>

            <p className = 'mx-auto max-w-4xl text-center text-xs text-slate-500'>Tip: Keep it concise and focused on measurable experience, relevant skills, and target role fit.</p>
        </div>
    </div>
  )
}

export default ProfessionalSummaryForm