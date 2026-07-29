// =====================================================
// AI-CHANGE
// Date: 2026-07-20
// Reason: Integrate AI section enhancement (experience job descriptions, projects, education details) in lists.
// Changes: Added handleFieldEnhance. Rendered AI Enhance button for textareas with loading spinner and status text. Imported api, Sparkles, Loader2.
// Connected Files: client/src/configs/api.js, server/routes/aiRoutes.js
// =====================================================
import { ChevronDown, ChevronUp, GripVertical, Plus, Trash2, Sparkles, Loader2 } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import apiClient from '../../../services/apiClient'

const isEmptyValue = (value) => value === undefined || value === null || String(value).trim() === ''

const SectionListEditor = ({
    title,
    description,
    data = [],
    onChange,
    createItem,
    fields = [],
    itemLabel = 'Entry',
    emptyTitle,
    emptyDescription,
    addLabel,
    getItemSummary,
}) => {
    const [collapsedMap, setCollapsedMap] = useState({})
    const [aiLoadingMap, setAiLoadingMap] = useState({})
    const [aiLoadingTextMap, setAiLoadingTextMap] = useState({})

    const handleFieldEnhance = async (itemIndex, fieldKey, currentValue) => {
        if (!currentValue || !currentValue.trim()) {
            alert("Please write something first so AI can enhance it.");
            return;
        }

        const mapKey = `${itemIndex}-${fieldKey}`;
        setAiLoadingMap((prev) => ({ ...prev, [mapKey]: true }));
        setAiLoadingTextMap((prev) => ({ ...prev, [mapKey]: "Enhancing..." }));

        try {
            const loadingTexts = ["Optimizing grammar...", "Polishing phrasing...", "Applying action verbs..."];
            let loadingIdx = 0;
            const textTimer = setInterval(() => {
                setAiLoadingTextMap((prev) => ({ ...prev, [mapKey]: loadingTexts[loadingIdx % loadingTexts.length] }));
                loadingIdx++;
            }, 1500);

            // Determine section based on title or labels
            let section = 'experience';
            if (title.toLowerCase().includes('project')) {
                section = 'projects';
            } else if (title.toLowerCase().includes('education')) {
                section = 'education';
            } else if (title.toLowerCase().includes('achievement')) {
                section = 'achievements';
            } else if (title.toLowerCase().includes('activity') || title.toLowerCase().includes('extracurricular')) {
                section = 'extracurricular_activities';
            }

            const response = await apiClient.post("/resume-ai/enhance-section", {
                section: section,
                userContent: currentValue
            });

            clearInterval(textTimer);
            if (response.data && response.data.enhancedContent) {
                updateItem(itemIndex, fieldKey, response.data.enhancedContent.trim());
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || error.message || "Failed to enhance text");
        } finally {
            setAiLoadingMap((prev) => ({ ...prev, [mapKey]: false }));
        }
    };

    const visibleEmptyTitle = emptyTitle || `No ${title.toLowerCase()} added yet`
    const visibleEmptyDescription = emptyDescription || `Click "${addLabel || `Add ${itemLabel}`}" to get started.`

    const fieldGroups = useMemo(() => {
        const leadingFields = fields.filter((field) => field.type !== 'textarea')
        const trailingFields = fields.filter((field) => field.type === 'textarea')
        return { leadingFields, trailingFields }
    }, [fields])

    const updateItem = (index, key, value) => {
        const next = [...data]
        next[index] = { ...next[index], [key]: value }
        onChange(next)
    }

    const addItem = () => {
        onChange([...data, createItem()])
    }

    const removeItem = (index) => {
        onChange(data.filter((_, currentIndex) => currentIndex !== index))
        setCollapsedMap((prev) => {
            const next = { ...prev }
            delete next[index]
            return next
        })
    }

    const moveItem = (index, direction) => {
        const nextIndex = index + direction
        if (nextIndex < 0 || nextIndex >= data.length) return

        const next = [...data]
        ;[next[index], next[nextIndex]] = [next[nextIndex], next[index]]
        onChange(next)

        setCollapsedMap((prev) => {
            const nextCollapsed = { ...prev }
            ;[nextCollapsed[index], nextCollapsed[nextIndex]] = [nextCollapsed[nextIndex], nextCollapsed[index]]
            return nextCollapsed
        })
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                    {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
                </div>

                <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-100"
                >
                    <Plus className="size-4" />
                    {addLabel || `Add ${itemLabel}`}
                </button>
            </div>

            {data.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center text-slate-500">
                    <p className="text-sm font-medium text-slate-700">{visibleEmptyTitle}</p>
                    <p className="mt-1 text-sm">{visibleEmptyDescription}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {data.map((item, index) => {
                        const collapsed = Boolean(collapsedMap[index])
                        const summary = getItemSummary ? getItemSummary(item, index) : ''

                        return (
                            <article key={item?._id || index} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 inline-flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                            <GripVertical className="size-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">
                                                {itemLabel} #{index + 1}
                                            </h4>
                                            {!isEmptyValue(summary) && <p className="mt-1 text-sm text-slate-500">{summary}</p>}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => moveItem(index, -1)}
                                            disabled={index === 0}
                                            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:border-emerald-200 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-30"
                                        >
                                            <ChevronUp className="size-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => moveItem(index, 1)}
                                            disabled={index === data.length - 1}
                                            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:border-emerald-200 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-30"
                                        >
                                            <ChevronDown className="size-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCollapsedMap((prev) => ({ ...prev, [index]: !collapsed }))}
                                            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:border-emerald-200 hover:text-emerald-700"
                                        >
                                            {collapsed ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="rounded-lg border border-rose-200 p-2 text-rose-500 transition-colors hover:bg-rose-50"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>

                                {!collapsed && (
                                    <div className="mt-4 space-y-4">
                                        <div className="grid gap-3 md:grid-cols-2">
                                            {fieldGroups.leadingFields.map((field) => {
                                                const fieldValue = item?.[field.key]

                                                if (field.type === 'checkbox') {
                                                    return (
                                                        <label key={field.key} className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 md:col-span-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={Boolean(fieldValue)}
                                                                onChange={(event) => updateItem(index, field.key, event.target.checked)}
                                                                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                                            />
                                                            <span>{field.label}</span>
                                                        </label>
                                                    )
                                                }

                                                const inputClassName = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100'

                                                return (
                                                    <label key={field.key} className={field.fullWidth ? 'md:col-span-2' : ''}>
                                                        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">{field.label}</span>
                                                        <input
                                                            type={field.type || 'text'}
                                                            value={fieldValue || ''}
                                                            onChange={(event) => updateItem(index, field.key, event.target.value)}
                                                            placeholder={field.placeholder}
                                                            className={inputClassName}
                                                        />
                                                    </label>
                                                )
                                            })}
                                        </div>

                                        {fieldGroups.trailingFields.length > 0 && (
                                            <div className="grid gap-3">
                                                {fieldGroups.trailingFields.map((field) => {
                                                    const fieldValue = item?.[field.key]
                                                    const inputClassName = 'w-full min-h-24 resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100'
                                                    const isEnhancing = Boolean(aiLoadingMap[`${index}-${field.key}`])

                                                    return (
                                                        <label key={field.key} className="block space-y-1">
                                                            <div className="flex items-center justify-between">
                                                                <span className="block text-xs font-medium uppercase tracking-wide text-slate-500">{field.label}</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleFieldEnhance(index, field.key, fieldValue)}
                                                                    disabled={isEnhancing}
                                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 transition cursor-pointer"
                                                                >
                                                                    {isEnhancing ? (
                                                                        <>
                                                                            <Loader2 className="size-3 animate-spin" />
                                                                            <span>{aiLoadingTextMap[`${index}-${field.key}`] || 'Enhancing...'}</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Sparkles className="size-3" />
                                                                            <span>AI Enhance</span>
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                            <textarea
                                                                rows={field.rows || 4}
                                                                value={fieldValue || ''}
                                                                onChange={(event) => updateItem(index, field.key, event.target.value)}
                                                                placeholder={field.placeholder}
                                                                className={inputClassName}
                                                            />
                                                        </label>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </article>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default SectionListEditor