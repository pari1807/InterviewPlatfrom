
import React from 'react'
import {
    formatDate,
    formatRange,
    getProjectEntries,
    getCertificationEntries,
    getAchievementEntries,
    getActivityEntries,
    toBulletList
} from './templateUtils'

const MinimalTemplate = ({ data, accentColor }) => {
    const projects = getProjectEntries(data)
    const certifications = getCertificationEntries(data)
    const achievements = getAchievementEntries(data)
    const activities = getActivityEntries(data)

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 font-light">
            {/* Header */}
            <header className="mb-10">
                <h1 className="text-4xl font-thin mb-4 tracking-wide">
                    {data.personal_info?.full_name || "Your Name"}
                </h1>

                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                    {data.personal_info?.email && <span>{data.personal_info.email}</span>}
                    {data.personal_info?.phone && <span>{data.personal_info.phone}</span>}
                    {data.personal_info?.location && <span>{data.personal_info.location}</span>}
                    {data.personal_info?.linkedin && (
                        <span className="break-all">{data.personal_info.linkedin}</span>
                    )}
                    {data.personal_info?.website && (
                        <span className="break-all">{data.personal_info.website}</span>
                    )}
                </div>
            </header>

            {/* Professional Summary */}
            {data.professional_summary && (
                <section className="mb-10">
                    <p className=" text-gray-700">
                        {data.professional_summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Experience
                    </h2>

                    <div className="space-y-6">
                        {data.experience.map((exp, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-lg font-medium">{exp.position}</h3>
                                    <span className="text-sm text-gray-500">
                                        {formatRange(exp.start_date, exp.end_date, exp.is_current || /^(present|current)$/i.test(String(exp.end_date || '')))}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-2">{exp.company}</p>
                                {exp.description && (
                                    <div className="text-gray-700 leading-relaxed whitespace-pre-line break-words mt-2">
                                        {exp.description}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Projects
                    </h2>

                    <div className="space-y-6">
                        {projects.map((proj, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-lg font-medium ">{proj.name}</h3>
                                    <span className="text-sm text-gray-500">
                                        {formatRange(proj.start_date, proj.end_date, false)}
                                    </span>
                                </div>
                                {proj.tech_stack && (
                                    <p className="text-gray-650 text-xs mb-1">Tech Stack: {proj.tech_stack}</p>
                                )}
                                {proj.description && (
                                    <div className="text-gray-750 leading-relaxed whitespace-pre-line break-words mt-2">
                                        {proj.description}
                                    </div>
                                )}
                                {(proj.github_url || proj.live_url) && (
                                    <div className="flex gap-3 text-xs">
                                        {proj.github_url && <a href={proj.github_url} target="_blank" rel="noreferrer" className="underline" style={{ color: accentColor }}>GitHub</a>}
                                        {proj.live_url && <a href={proj.live_url} target="_blank" rel="noreferrer" className="underline" style={{ color: accentColor }}>Live Demo</a>}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Education
                    </h2>

                    <div className="space-y-4">
                        {data.education.map((edu, index) => (
                            <div key={index} className="flex justify-between items-baseline">
                                <div>
                                    <h3 className="font-medium">
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                    </h3>
                                    <p className="text-gray-600">{edu.institution}</p>
                                    {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                                </div>
                                <span className="text-sm text-gray-500">
                                    {formatDate(edu.graduation_date)}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Skills
                    </h2>

                    <div className="text-gray-700">
                        {data.skills.join(" • ")}
                    </div>
                </section>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Certifications
                    </h2>
                    <div className="space-y-4">
                        {certifications.map((cert, index) => {
                            const certName = cert.certificate_name || cert.name || cert.title || cert.description;
                            return (
                                <div key={index} className="flex justify-between items-baseline">
                                    <div>
                                        <h3 className="font-medium">{certName}</h3>
                                        <p className="text-gray-600">{cert.issuer}</p>
                                        {cert.credential_url && (
                                            <a href={cert.credential_url} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color: accentColor }}>Credential</a>
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {formatDate(cert.issue_date || cert.date)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Achievements */}
            {achievements && achievements.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Achievements
                    </h2>
                    <div className="space-y-4">
                        {achievements.map((ach, index) => {
                            const title = ach.title || ach.name;
                            return (
                                <div key={index} className="flex justify-between items-baseline">
                                    <div>
                                        <h3 className="font-medium">{title}</h3>
                                        {ach.organization && <p className="text-gray-600">{ach.organization}</p>}
                                        {ach.description && <p className="text-sm text-gray-500 mt-1">{ach.description}</p>}
                                    </div>
                                    <div className="text-right text-sm text-gray-500">
                                        <span>{formatDate(ach.date)}</span>
                                        {ach.proof_url && (
                                            <div>
                                                <a href={ach.proof_url} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color: accentColor }}>Proof</a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Extracurricular Activities */}
            {activities && activities.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Activities
                    </h2>
                    <div className="space-y-4">
                        {activities.map((act, index) => {
                            const activityName = act.activity || act.name || act.title;
                            return (
                                <div key={index} className="flex justify-between items-baseline">
                                    <div>
                                        <h3 className="font-medium">{activityName}</h3>
                                        <p className="text-gray-600">{[act.position, act.organization].filter(Boolean).join(' at ')}</p>
                                        {act.description && <p className="text-sm text-gray-550 mt-1">{act.description}</p>}
                                    </div>
                                    <div className="text-right text-sm text-gray-500">
                                        <span>{formatRange(act.start_date, act.end_date, false)}</span>
                                        {act.url && (
                                            <div>
                                                <a href={act.url} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color: accentColor }}>Link</a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
}

export default MinimalTemplate;