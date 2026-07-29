import React, { useState } from 'react'
import { Check, Layout } from 'lucide-react'

const TemplateSelector = ({selectedTemplate, onChange}) => {
    const [isOpen, setIsOpen] = useState(false);

    const templates = [
        {
            id: "classic",
            name : "Classic",
            preview: "A clean, traditional resume format with clear sections and professional typography"
        },
        {
            id: "modern",
            name: "Modern",
            preview: "Sleek design with strategic use of color and modern font choices"
        },
        {
            id: "minimal-image",
            name: "Minimal Image",
            preview: "Minimal design with a single image and clean typography"
        },
        {
            id: "minimal",
            name: "Minimal",
            preview: "Ultra-clean design that puts your content front and center"
        },
        {
            id: "professional",
            name: "Professional",
            preview: "ATS-friendly single-column layout with calm spacing and strong hierarchy"
        },
        {
            id: "executive",
            name: "Executive",
            preview: "Premium layout with a refined header and polished section structure"
        },
        {
            id: "two-column",
            name: "Two Column",
            preview: "Balanced two-column structure for dense, highly scannable resumes"
        }
    ]
  return (
    <div className = 'relative'>
        <button type="button" onClick={() => setIsOpen(!isOpen)} className='flex items-center gap-2 text-sm font-medium text-emerald-700 bg-white border border-emerald-200 shadow-sm hover:border-emerald-300 transition-all px-3 py-2 rounded-xl'>
            <Layout size={14} /> <span className='max-sm:hidden'>Template</span>
        </button>
        {isOpen && (
            <div className='absolute top-full left-0 w-80 max-h-88 overflow-auto p-3 mt-2 space-y-3 z-20 bg-white rounded-2xl border border-emerald-100 shadow-xl shadow-emerald-100/60'>
                {templates.map((template)=> (
                    <button
                        type="button"
                        key={template.id}
                        onClick={() => {onChange(template.id); setIsOpen(false)}}
                        className={`relative w-full text-left p-3 border rounded-xl cursor-pointer transition-all ${selectedTemplate === template.id ? "border-emerald-400 bg-emerald-50" : "border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/60"}`}
                    >
                    
                    {selectedTemplate === template.id && (
                        <div className = "absolute top-2 right-2">
                            <div className='size-5 bg-emerald-500 rounded-full flex items-center justify-center'>
                                <Check className = "w-3 h-3 text-white" />
                            </div>
                        </div>
                    )}

                    <div className = "space-y-1">
                        <h4 className='font-medium text-slate-900'>{template.name}</h4>
                        <div className='mt-2 p-2 bg-slate-50 rounded-lg text-xs text-slate-500 italic'>{template.preview}</div>
                    </div>
                    </button>
                ))}
            </div>
        )}
    </div>
  )
}

export default TemplateSelector