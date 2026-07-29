// =====================================================
// AI-CHANGE
// Date: 2026-07-20
// Reason: Integrate AI Skills list formatting/normalizing to standard ATS terminology.
// Changes: Implemented handleAiEnhance using the generic section enhancer. Added Loader2, api imports and the AI Enhance button next to the section title.
// Connected Files: client/src/configs/api.js, server/routes/aiRoutes.js
// =====================================================
import { Plus, Sparkles, X, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import apiClient from '../../../services/apiClient'

const SkillForm = ({ data, onChange }) => {
    const [newSkill, setNewSkill] = useState('')
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("Enhancing...");

    const addSkill = () => {
        const skillValue = newSkill.trim()
        if (skillValue && !data.includes(skillValue)) {
            onChange([...data, skillValue])
            setNewSkill('')
        }
    }

    const removeSkill = (indexToRemove) => {
        onChange(data.filter((_, index) => index !== indexToRemove))
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            addSkill()
        }
    }

    const handleAiEnhance = async () => {
        if (!data || data.length === 0) {
            alert("Please add some skills first so AI can suggest enhancements.");
            return;
        }

        setLoading(true);
        setLoadingText("Analyzing skills...");
        try {
            const texts = ["Standardizing naming...", "Filtering terms...", "Optimizing list..."];
            let textIdx = 0;
            const interval = setInterval(() => {
                setLoadingText(texts[textIdx % texts.length]);
                textIdx++;
            }, 1500);

            const response = await apiClient.post("/resume-ai/enhance-section", {
                section: 'skills',
                userContent: data.join(', ')
            });

            clearInterval(interval);
            if (response.data && response.data.enhancedContent) {
                const enhancedSkills = response.data.enhancedContent
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean);
                onChange(enhancedSkills);
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || error.message || "Failed to enhance skills");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Skills</h3>
                    <p className="text-sm text-slate-500">Add simple comma-ready skills that can be grouped in the resume.</p>
                </div>

                <button
                    type="button"
                    onClick={handleAiEnhance}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50 cursor-pointer"
                >
                    {loading ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            <span>{loadingText}</span>
                        </>
                    ) : (
                        <>
                            <Sparkles className="size-4" />
                            <span>AI Enhance</span>
                        </>
                    )}
                </button>
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Add a skill"
                    value={newSkill}
                    onChange={(event) => setNewSkill(event.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                />

                <button
                    type="button"
                    onClick={addSkill}
                    disabled={!newSkill.trim()}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Plus className="size-4" />
                    Add
                </button>
            </div>

            {data.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {data.map((skill, index) => (
                        <span key={index} className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm text-emerald-800">
                            {skill}
                            <button type="button" onClick={() => removeSkill(index)} className="ml-1 rounded-full p-0.5 transition-colors hover:bg-emerald-100">
                                <X className="size-3" />
                            </button>
                        </span>
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-8 text-center text-slate-500">
                    <Sparkles className="mx-auto size-12 text-slate-300" />
                    <p className="mt-2 font-medium text-slate-700">No skills added yet</p>
                    <p className="text-sm">Add technical and domain skills you want grouped in the resume.</p>
                </div>
            )}

            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <strong>Tip:</strong> Add 8-12 relevant skills across languages, frameworks, and tools.
            </div>
        </div>
    )
}

export default SkillForm