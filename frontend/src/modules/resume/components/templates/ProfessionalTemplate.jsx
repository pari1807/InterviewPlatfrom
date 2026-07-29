import React from 'react'
import TemplateContent from './TemplateContent'

const ProfessionalTemplate = ({ data, accentColor = '#10b981' }) => {
    const personalInfo = data?.personal_info || {}

    return (
        <div className="mx-auto max-w-[8.27in] bg-white text-slate-800">
            <header className="border-b border-slate-200 px-8 py-6 text-center" style={{ background: `linear-gradient(180deg, ${accentColor}12 0%, #ffffff 100%)` }}>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    {personalInfo.full_name || 'Your Name'}
                </h1>
                <p className="mt-1 text-[0.88rem] text-slate-700">{personalInfo.profession || 'Professional Title'}</p>
                <p className="mt-1 text-[0.84rem] text-slate-600">
                    {[personalInfo.phone, personalInfo.email, personalInfo.location].filter(Boolean).join(' • ')}
                </p>
                <p className="mt-1 text-[0.84rem] text-slate-600">
                    {[personalInfo.linkedin, personalInfo.website].filter(Boolean).join(' • ')}
                </p>
            </header>

            <TemplateContent data={data} accentColor={accentColor} layout="single" />
        </div>
    )
}

export default ProfessionalTemplate
