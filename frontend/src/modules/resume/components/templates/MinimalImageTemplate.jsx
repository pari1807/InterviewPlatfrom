import { Mail, Phone, MapPin } from "lucide-react";
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

const MinimalImageTemplate = ({ data, accentColor }) => {
    const projects = getProjectEntries(data)
    const certifications = getCertificationEntries(data)
    const achievements = getAchievementEntries(data)
    const activities = getActivityEntries(data)

    return (
        <div className="max-w-5xl mx-auto bg-white text-zinc-800">
            <div className="grid grid-cols-3">

                <div className="col-span-1  py-10">
                    {/* Image */}
                    {data.personal_info?.image && typeof data.personal_info.image === 'string' ? (
                        <div className="mb-6">
                            <img src={data.personal_info.image} alt="Profile" className="w-32 h-32 object-cover rounded-full mx-auto" style={{ background: accentColor+'70' }} />
                        </div>
                    ) : (
                        data.personal_info?.image && typeof data.personal_info.image === 'object' ? (
                            <div className="mb-6">
                                <img src={URL.createObjectURL(data.personal_info.image)} alt="Profile" className="w-32 h-32 object-cover rounded-full mx-auto" />
                            </div>
                        ) : null
                    )}
                </div>

                {/* Name + Title */}
                <div className="col-span-2 flex flex-col justify-center py-10 px-8">
                    <h1 className="text-4xl font-bold text-zinc-700 tracking-widest">
                        {data.personal_info?.full_name || "Your Name"}
                    </h1>
                    <p className="uppercase text-zinc-600 font-medium text-sm tracking-widest">
                        {data?.personal_info?.profession || "Profession"}
                    </p>
                </div>

                {/* Left Sidebar */}
                <aside className="col-span-1 border-r border-zinc-400 p-6 pt-0">


                    {/* Contact */}
                    <section className="mb-8">
                        <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                            CONTACT
                        </h2>
                        <div className="space-y-2 text-sm">
                            {data.personal_info?.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone size={14} style={{ color: accentColor }} />
                                    <span>{data.personal_info.phone}</span>
                                </div>
                            )}
                            {data.personal_info?.email && (
                                <div className="flex items-center gap-2">
                                    <Mail size={14} style={{ color: accentColor }} />
                                    <span>{data.personal_info.email}</span>
                                </div>
                            )}
                            {data.personal_info?.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} style={{ color: accentColor }} />
                                    <span>{data.personal_info.location}</span>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Education */}
                    {data.education && data.education.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                                EDUCATION
                            </h2>
                            <div className="space-y-4 text-sm">
                                {data.education.map((edu, index) => (
                                    <div key={index}>
                                        <p className="font-semibold uppercase">{edu.degree}</p>
                                        <p className="text-zinc-600">{edu.institution}</p>
                                        <p className="text-xs text-zinc-500">
                                            {formatDate(edu.graduation_date)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {data.skills && data.skills.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                                SKILLS
                            </h2>
                            <ul className="space-y-1 text-sm">
                                {data.skills.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Certifications */}
                    {certifications && certifications.length > 0 && (
                        <section>
                            <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                                CERTIFICATIONS
                            </h2>
                            <div className="space-y-4 text-sm">
                                {certifications.map((cert, index) => {
                                    const certName = cert.certificate_name || cert.name || cert.title || cert.description;
                                    return (
                                        <div key={index}>
                                            <p className="font-semibold uppercase">{certName}</p>
                                            <p className="text-zinc-600">{cert.issuer}</p>
                                            <p className="text-xs text-zinc-500">
                                                {formatDate(cert.issue_date || cert.date)}
                                            </p>
                                            {cert.credential_url && (
                                                <a href={cert.credential_url} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color: accentColor }}>View Credential</a>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}
                </aside>

                {/* Right Content */}
                <main className="col-span-2 p-8 pt-0 space-y-8">

                    {/* Summary */}
                    {data.professional_summary && (
                        <section>
                            <h2 className="text-sm font-semibold tracking-widest mb-3" style={{ color: accentColor }} >
                                SUMMARY
                            </h2>
                            <p className="text-zinc-700 leading-relaxed">
                                {data.professional_summary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {data.experience && data.experience.length > 0 && (
                        <section>
                            <h2 className="text-sm font-semibold tracking-widest mb-4" style={{ color: accentColor }} >
                                EXPERIENCE
                            </h2>
                            <div className="space-y-6">
                                {data.experience.map((exp, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-semibold text-zinc-900">
                                                {exp.position}
                                            </h3>
                                            <span className="text-xs text-zinc-500">
                                                {formatRange(exp.start_date, exp.end_date, exp.is_current || /^(present|current)$/i.test(String(exp.end_date || '')))}
                                            </span>
                                        </div>
                                        <p className="text-sm mb-2" style={{ color: accentColor }} >
                                            {exp.company}
                                        </p>
                                        {exp.description && (
                                            <div className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line break-words mt-2">
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
                        <section>
                            <h2 className="text-sm uppercase tracking-widest font-semibold mb-4" style={{ color: accentColor }}>
                                PROJECTS
                            </h2>
                            <div className="space-y-6">
                                {projects.map((proj, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="text-md font-semibold text-zinc-805">{proj.name}</h3>
                                            <span className="text-xs text-zinc-500">
                                                {formatRange(proj.start_date, proj.end_date, false)}
                                            </span>
                                        </div>
                                        {proj.tech_stack && (
                                            <p className="text-xs font-medium text-zinc-500">Tech Stack: {proj.tech_stack}</p>
                                        )}
                                        {proj.description && (
                                            <div className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line break-words mt-2">
                                                {proj.description}
                                            </div>
                                        )}
                                        {(proj.github_url || proj.live_url) && (
                                            <div className="flex gap-3 text-xs mt-1">
                                                {proj.github_url && <a href={proj.github_url} target="_blank" rel="noreferrer" className="underline" style={{ color: accentColor }}>GitHub</a>}
                                                {proj.live_url && <a href={proj.live_url} target="_blank" rel="noreferrer" className="underline" style={{ color: accentColor }}>Live Demo</a>}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Achievements */}
                    {achievements && achievements.length > 0 && (
                        <section>
                            <h2 className="text-sm uppercase tracking-widest font-semibold mb-4" style={{ color: accentColor }}>
                                ACHIEVEMENTS
                            </h2>
                            <div className="space-y-4">
                                {achievements.map((ach, index) => {
                                    const title = ach.title || ach.name;
                                    return (
                                        <div key={index}>
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="text-md font-semibold text-zinc-805">{title}</h3>
                                                <span className="text-xs text-zinc-500">{formatDate(ach.date)}</span>
                                            </div>
                                            {ach.organization && <p className="text-xs text-zinc-500">{ach.organization}</p>}
                                            {ach.description && <p className="text-sm text-zinc-700 mt-1">{ach.description}</p>}
                                            {ach.proof_url && (
                                                <a href={ach.proof_url} target="_blank" rel="noreferrer" className="text-xs underline mt-1 block" style={{ color: accentColor }}>View Proof</a>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Extracurricular Activities */}
                    {activities && activities.length > 0 && (
                        <section>
                            <h2 className="text-sm uppercase tracking-widest font-semibold mb-4" style={{ color: accentColor }}>
                                ACTIVITIES
                            </h2>
                            <div className="space-y-4">
                                {activities.map((act, index) => {
                                    const activityName = act.activity || act.name || act.title;
                                    return (
                                        <div key={index}>
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="text-md font-semibold text-zinc-805">{activityName}</h3>
                                                <span className="text-xs text-zinc-500">{formatRange(act.start_date, act.end_date, false)}</span>
                                            </div>
                                            <p className="text-xs text-zinc-500">{[act.position, act.organization].filter(Boolean).join(' at ')}</p>
                                            {act.description && <p className="text-sm text-zinc-700 mt-1">{act.description}</p>}
                                            {act.url && (
                                                <a href={act.url} target="_blank" rel="noreferrer" className="text-xs underline mt-1 block" style={{ color: accentColor }}>Link</a>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}


export default MinimalImageTemplate;