import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { FaLinkedin } from "react-icons/fa"
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

const ModernTemplate = ({ data, accentColor }) => {
	const projects = getProjectEntries(data)
	const certifications = getCertificationEntries(data)
	const achievements = getAchievementEntries(data)
	const activities = getActivityEntries(data)

	return (
		<div className="max-w-4xl mx-auto bg-white text-gray-800">
			{/* Header */}
			<header className="p-8 text-white" style={{ backgroundColor: accentColor }}>
				<h1 className="text-4xl font-light mb-3">
					{data.personal_info?.full_name || "Your Name"}
				</h1>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm ">
					{data.personal_info?.email && (
						<div className="flex items-center gap-2">
							<Mail className="size-4" />
							<span>{data.personal_info.email}</span>
						</div>
					)}
					{data.personal_info?.phone && (
						<div className="flex items-center gap-2">
							<Phone className="size-4" />
							<span>{data.personal_info.phone}</span>
						</div>
					)}
					{data.personal_info?.location && (
						<div className="flex items-center gap-2">
							<MapPin className="size-4" />
							<span>{data.personal_info.location}</span>
						</div>
					)}
					{data.personal_info?.linkedin && (
						<a target="_blank" href={data.personal_info?.linkedin} className="flex items-center gap-2">
							<FaLinkedin className="size-4" />
							<span className="break-all text-xs">{data.personal_info.linkedin.split("https://www.")[1] ? data.personal_info.linkedin.split("https://www.")[1] : data.personal_info.linkedin}</span>
						</a>
					)}
					{data.personal_info?.website && (
						<a target="_blank" href={data.personal_info?.website} className="flex items-center gap-2">
							<Globe className="size-4" />
							<span className="break-all text-xs">{data.personal_info.website.split("https://")[1] ? data.personal_info.website.split("https://")[1] : data.personal_info.website}</span>
						</a>
					)}
				</div>
			</header>

			<div className="p-8">
				{/* Professional Summary */}
				{data.professional_summary && (
					<section className="mb-8">
						<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
							Professional Summary
						</h2>
						<p className="text-gray-700 ">{data.professional_summary}</p>
					</section>
				)}

				{/* Experience */}
				{data.experience && data.experience.length > 0 && (
					<section className="mb-8">
						<h2 className="text-2xl font-light mb-6 pb-2 border-b border-gray-200">
							Experience
						</h2>

						<div className="space-y-6">
							{data.experience.map((exp, index) => (
								<div key={index} className="relative pl-6 border-l border-gray-200">

									<div className="flex justify-between items-start mb-2">
										<div>
											<h3 className="text-xl font-medium text-gray-900">{exp.position}</h3>
											<p className="font-medium" style={{ color: accentColor }}>{exp.company}</p>
										</div>
										<div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
											{formatRange(exp.start_date, exp.end_date, exp.is_current || /^(present|current)$/i.test(String(exp.end_date || '')))}
										</div>
									</div>
									{exp.description && (
										<div className="text-gray-700 leading-relaxed text-sm whitespace-pre-line break-words mt-3">
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
					<section className="mb-8">
						<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
							Projects
						</h2>

						<div className="space-y-6">
							{projects.map((proj, index) => (
								<div key={index} className="relative pl-6 border-l border-gray-200" style={{ borderLeftColor: accentColor }}>
									<div className="flex justify-between items-start">
										<div>
											<h3 className="text-lg font-medium text-gray-900">{proj.name}</h3>
											{proj.tech_stack && (
												<p className="text-sm font-medium text-gray-650 mt-1">Tech Stack: {proj.tech_stack}</p>
											)}
										</div>
										<div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
											{formatRange(proj.start_date, proj.end_date, false)}
										</div>
									</div>
									{proj.description && (
										<div className="text-gray-700 leading-relaxed text-sm whitespace-pre-line break-words mt-3">
											{proj.description}
										</div>
									)}
									{(proj.github_url || proj.live_url) && (
										<div className="flex gap-3 text-xs mt-2">
											{proj.github_url && <a href={proj.github_url} target="_blank" rel="noreferrer" className="underline" style={{ color: accentColor }}>GitHub</a>}
											{proj.live_url && <a href={proj.live_url} target="_blank" rel="noreferrer" className="underline" style={{ color: accentColor }}>Live Demo</a>}
										</div>
									)}
								</div>
							))}
						</div>
					</section>
				)}

				<div className="grid sm:grid-cols-2 gap-8">
					{/* Left Column of Grid */}
					<div className="space-y-8">
						{/* Education */}
						{data.education && data.education.length > 0 && (
							<section>
								<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
									Education
								</h2>

								<div className="space-y-4">
									{data.education.map((edu, index) => (
										<div key={index}>
											<h3 className="font-semibold text-gray-900">
												{edu.degree} {edu.field && `in ${edu.field}`}
											</h3>
											<p style={{ color: accentColor }}>{edu.institution}</p>
											<div className="flex justify-between items-center text-sm text-gray-600">
												<span>{formatDate(edu.graduation_date)}</span>
												{edu.gpa && <span>GPA: {edu.gpa}</span>}
											</div>
										</div>
									))}
								</div>
							</section>
						)}

						{/* Achievements */}
						{achievements && achievements.length > 0 && (
							<section>
								<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
									Achievements
								</h2>
								<div className="space-y-4">
									{achievements.map((ach, index) => {
										const title = ach.title || ach.name;
										return (
											<div key={index}>
												<h3 className="font-semibold text-gray-900">{title}</h3>
												{ach.organization && <p style={{ color: accentColor }}>{ach.organization}</p>}
												<div className="flex justify-between items-center text-sm text-gray-650 mt-1">
													<span>{formatDate(ach.date)}</span>
													{ach.proof_url && (
														<a href={ach.proof_url} target="_blank" rel="noreferrer" className="underline text-xs" style={{ color: accentColor }}>Proof</a>
													)}
												</div>
												{ach.description && <p className="text-sm text-gray-600 mt-2">{ach.description}</p>}
											</div>
										);
									})}
								</div>
							</section>
						)}

						{/* Extracurricular Activities */}
						{activities && activities.length > 0 && (
							<section>
								<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
									Activities
								</h2>
								<div className="space-y-4">
									{activities.map((act, index) => {
										const activityName = act.activity || act.name || act.title;
										return (
											<div key={index}>
												<h3 className="font-semibold text-gray-900">{activityName}</h3>
												<p style={{ color: accentColor }}>{[act.position, act.organization].filter(Boolean).join(' at ')}</p>
												<div className="flex justify-between items-center text-sm text-gray-650 mt-1">
													<span>{formatRange(act.start_date, act.end_date, false)}</span>
													{act.url && (
														<a href={act.url} target="_blank" rel="noreferrer" className="underline text-xs" style={{ color: accentColor }}>Link</a>
													)}
												</div>
												{act.description && <p className="text-sm text-gray-600 mt-2">{act.description}</p>}
											</div>
										);
									})}
								</div>
							</section>
						)}
					</div>

					{/* Right Column of Grid */}
					<div className="space-y-8">
						{/* Skills */}
						{data.skills && data.skills.length > 0 && (
							<section>
								<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
									Skills
								</h2>

								<div className="flex flex-wrap gap-2">
									{data.skills.map((skill, index) => (
										<span
											key={index}
											className="px-3 py-1 text-sm text-white rounded-full"
											style={{ backgroundColor: accentColor }}
										>
											{skill}
										</span>
									))}
								</div>
							</section>
						)}

						{/* Certifications */}
						{certifications && certifications.length > 0 && (
							<section>
								<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
									Certifications
								</h2>
								<div className="space-y-4">
									{certifications.map((cert, index) => {
										const certName = cert.certificate_name || cert.name || cert.title || cert.description;
										return (
											<div key={index}>
												<h3 className="font-semibold text-gray-900">{certName}</h3>
												<p style={{ color: accentColor }}>{cert.issuer}</p>
												<div className="flex justify-between items-center text-sm text-gray-600">
													<span>{formatDate(cert.issue_date || cert.date)}</span>
													{cert.credential_url && (
														<a href={cert.credential_url} target="_blank" rel="noreferrer" className="underline text-xs" style={{ color: accentColor }}>Credential</a>
													)}
												</div>
											</div>
										);
									})}
								</div>
							</section>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default ModernTemplate;