import { Globe, Mail, MapPin, Phone } from 'lucide-react'
import { FaLinkedin } from 'react-icons/fa'
import React from 'react'
import { formatDate, toBulletList, formatRange } from './templateUtils'

const TwoColumnTemplate = ({ data, accentColor = '#10b981' }) => {
    const personalInfo = data?.personal_info || {}
    const experience = data?.experience || []
    const education = data?.education || []
    const skills = data?.skills || []
    const projects = data?.project || []
    const certificates = data?.certificates || data?.certifications || []
    const achievements = data?.achievements || []
    const extracurricular = data?.extracurricular_activities || data?.extracurricularActivities || data?.activities || []

    return (
        <div className="mx-auto max-w-5xl bg-white text-slate-800">
            <header className="border-b border-emerald-100 px-8 py-8" style={{ background: `linear-gradient(180deg, ${accentColor}12 0%, #ffffff 100%)` }}>
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700">Two Column Resume</p>
                        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">{personalInfo.full_name || 'Your Name'}</h1>
                        <p className="mt-2 text-lg text-slate-600">{personalInfo.profession || 'Professional Title'}</p>
                    </div>
                    <div className="flex flex-col gap-2 text-sm text-slate-600">
                        {personalInfo.email && <div className="flex items-center gap-2"><Mail className="size-4 text-emerald-600" /><span>{personalInfo.email}</span></div>}
                        {personalInfo.phone && <div className="flex items-center gap-2"><Phone className="size-4 text-emerald-600" /><span>{personalInfo.phone}</span></div>}
                        {personalInfo.location && <div className="flex items-center gap-2"><MapPin className="size-4 text-emerald-600" /><span>{personalInfo.location}</span></div>}
                        {personalInfo.linkedin && <div className="flex items-center gap-2"><FaLinkedin className="size-4 text-emerald-600" /><span className="break-all">{personalInfo.linkedin}</span></div>}
                        {personalInfo.website && <div className="flex items-center gap-2"><Globe className="size-4 text-emerald-600" /><span className="break-all">{personalInfo.website}</span></div>}
                    </div>
                </div>
            </header>

            <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
                <aside className="space-y-8 border-b border-slate-100 bg-slate-50 px-8 py-8 lg:border-b-0 lg:border-r">
                    {data.professional_summary && (
                        <section>
                            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Profile</h2>
                            <p className="leading-relaxed text-slate-700">{data.professional_summary}</p>
                        </section>
                    )}

                    {skills.length > 0 && (
                        <section>
                            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, index) => (
                                    <span key={index} className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-sm text-slate-700">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {education.length > 0 && (
                        <section>
                            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Education</h2>
                            <div className="space-y-4">
                                {education.map((edu, index) => (
                                    <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4">
                                        <h3 className="font-semibold text-slate-900">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                                        <p className="mt-1 text-slate-600">{edu.institution}</p>
                                        <p className="mt-2 text-sm text-slate-500">{formatDate(edu.graduation_date)} {edu.gpa ? `• GPA ${edu.gpa}` : ''}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </aside>

                <main className="space-y-8 px-8 py-8">
                    {experience.length > 0 && (
                        <section>
                            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Experience</h2>
                            <div className="space-y-6">
                                {experience.map((exp, index) => (
                                    <div key={index} className="border-l-2 border-emerald-200 pl-4">
                                        <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-900">{exp.position}</h3>
                                                <p className="font-medium text-emerald-700">{exp.company}</p>
                                            </div>
                                            <p className="text-sm text-slate-500">
                                                {formatRange(exp.start_date, exp.end_date, exp.is_current || /^(present|current)$/i.test(String(exp.end_date || '')))}
                                            </p>
                                        </div>
                                        {exp.description && (
                                            <div className="mt-3 text-sm leading-relaxed text-slate-700 whitespace-pre-line break-words">
                                                {exp.description}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {projects.length > 0 && (
                        <section>
                            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Projects</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                {projects.map((project, index) => (
                                    <article key={index} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex flex-col justify-between">
                                        <div>
                                            <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                                                <h3 className="font-semibold text-slate-900">{project.name}</h3>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                    {formatRange(project.start_date, project.end_date, false)}
                                                </span>
                                            </div>
                                            {(project.tech_stack || project.type) && (
                                                <p className="mt-1 text-sm font-medium text-emerald-700">
                                                    {project.tech_stack || project.type}
                                                </p>
                                            )}
                                            {project.description && (
                                                <div className="mt-2 text-sm leading-relaxed text-slate-700 whitespace-pre-line break-words">
                                                    {project.description}
                                                </div>
                                            )}
                                        </div>
                                        {(project.github_url || project.live_url) && (
                                            <div className="flex gap-3 text-xs mt-3 border-t border-slate-100 pt-2">
                                                {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className="underline font-medium hover:text-slate-900" style={{ color: accentColor }}>GitHub</a>}
                                                {project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer" className="underline font-medium hover:text-slate-900" style={{ color: accentColor }}>Live Demo</a>}
                                            </div>
                                        )}
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}

                    {certificates.length > 0 && (
                        <section>
                            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Certificates</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                {certificates.map((cert, index) => {
                                    const certName = typeof cert === 'string' ? cert : cert.certificate_name || cert.name || cert.title || cert.description;
                                    const issuer = typeof cert === 'string' ? '' : cert.issuer;
                                    const date = typeof cert === 'string' ? '' : formatDate(cert.issue_date || cert.date);
                                    const link = typeof cert === 'string' ? '' : cert.credential_url || cert.url;
                                    return (
                                        <article key={index} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                            <h3 className="font-semibold text-slate-900">{certName}</h3>
                                            {issuer && <p className="mt-1 text-sm text-slate-600">{issuer}</p>}
                                            <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
                                                <span>{date}</span>
                                                {link && (
                                                    <a href={link} target="_blank" rel="noreferrer" className="underline font-medium text-xs" style={{ color: accentColor }}>Credential</a>
                                                )}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {achievements.length > 0 && (
                        <section>
                            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Achievements</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                {achievements.map((ach, index) => {
                                    const title = typeof ach === 'string' ? ach : ach.title || ach.name;
                                    const org = typeof ach === 'string' ? '' : ach.organization;
                                    const date = typeof ach === 'string' ? '' : formatDate(ach.date);
                                    const link = typeof ach === 'string' ? '' : ach.proof_url || ach.url;
                                    const desc = typeof ach === 'string' ? '' : ach.description;
                                    return (
                                        <article key={index} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                            <h3 className="font-semibold text-slate-900">{title}</h3>
                                            {org && <p className="mt-1 text-sm text-slate-650">{org}</p>}
                                            {desc && <p className="mt-2 text-sm text-slate-700">{desc}</p>}
                                            {(date || link) && (
                                                <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
                                                    <span>{date}</span>
                                                    {link && (
                                                        <a href={link} target="_blank" rel="noreferrer" className="underline font-medium text-xs" style={{ color: accentColor }}>Proof</a>
                                                    )}
                                                </div>
                                            )}
                                        </article>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {extracurricular.length > 0 && (
                        <section>
                            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Extracurricular Activities</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                {extracurricular.map((act, index) => {
                                    const name = typeof act === 'string' ? act : act.activity || act.name || act.title;
                                    const org = typeof act === 'string' ? '' : act.organization;
                                    const pos = typeof act === 'string' ? '' : act.position;
                                    const range = typeof act === 'string' ? '' : formatRange(act.start_date, act.end_date, false);
                                    const link = typeof act === 'string' ? '' : act.url;
                                    const desc = typeof act === 'string' ? '' : act.description;
                                    return (
                                        <article key={index} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                            <h3 className="font-semibold text-slate-900">{name}</h3>
                                            {(pos || org) && <p className="mt-1 text-sm text-slate-600">{[pos, org].filter(Boolean).join(' at ')}</p>}
                                            {desc && <p className="mt-2 text-sm text-slate-700">{desc}</p>}
                                            {(range || link) && (
                                                <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
                                                    <span>{range}</span>
                                                    {link && (
                                                        <a href={link} target="_blank" rel="noreferrer" className="underline font-medium text-xs" style={{ color: accentColor }}>Link</a>
                                                    )}
                                                </div>
                                            )}
                                        </article>
                                    );
                                })}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    )
}

export default TwoColumnTemplate
