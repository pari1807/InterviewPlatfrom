import React from 'react'
import {
  formatDate,
  formatRange,
  formatUrlLabel,
  getActivityEntries,
  getAchievementEntries,
  getCertificationEntries,
  getContactLine,
  getProjectEntries,
  groupSkills,
  toBulletList,
} from './templateUtils'

const SectionTitle = ({ children, accentColor }) => (
  <h2 className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-slate-900" style={{ color: accentColor }}>
    {children}
  </h2>
)

const MetaLine = ({ items = [] }) => {
  const visibleItems = items.filter(Boolean)
  if (visibleItems.length === 0) return null

  return <p className="text-[0.82rem] text-slate-600">{visibleItems.join(' • ')}</p>
}

const LinkedList = ({ links = [] }) => {
  const visibleLinks = links.filter((link) => link?.url)
  if (visibleLinks.length === 0) return null

  return (
    <p className="mt-1 text-[0.82rem] text-slate-600">
      {visibleLinks.map((link, index) => (
        <span key={`${link.label}-${index}`}>
          <a href={link.url} target="_blank" rel="noreferrer" className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-slate-900">
            {link.label}
          </a>
          {index < visibleLinks.length - 1 && <span className="mx-1 text-slate-400">|</span>}
        </span>
      ))}
    </p>
  )
}

const RenderBullets = ({ value }) => {
  if (!value) return null

  return (
    <div className="mt-1 text-[0.84rem] leading-5 text-slate-705 whitespace-pre-line break-words">
      {value}
    </div>
  )
}

const renderProjectLinks = (project) => (
  <LinkedList
    links={[
      { label: 'GitHub', url: project.github_url || project.github || project.repository_url || project.repo_url },
      { label: 'Live Demo', url: project.live_url || project.demo_url || project.preview_url },
    ]}
  />
)

const TemplateContent = ({ data, accentColor = '#10b981', layout = 'single' }) => {
  const personalInfo = data?.personal_info || {}
  const experience = data?.experience || []
  const projects = getProjectEntries(data)
  const education = data?.education || []
  const skills = data?.skills || []
  const certifications = getCertificationEntries(data)
  const achievements = getAchievementEntries(data)
  const activities = getActivityEntries(data)
  const skillGroups = groupSkills(skills)

  const SkillsBlock = () => (
    <section>
      <SectionTitle accentColor={accentColor}>Skills</SectionTitle>
      {skillGroups.length > 0 ? (
        <div className="space-y-1 text-[0.84rem] text-slate-700">
          {skillGroups.map((group) => (
            <p key={group.label}>
              <span className="font-semibold text-slate-900">{group.label}:</span> {group.values.join(', ')}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-[0.84rem] text-slate-700">{skills.join(', ')}</p>
      )}
    </section>
  )

  const EducationBlock = () => (
    education.length > 0 ? (
      <section>
        <SectionTitle accentColor={accentColor}>Education</SectionTitle>
        <div className="space-y-3">
          {education.map((edu, index) => (
            <div key={edu._id || index}>
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <h3 className="text-[0.88rem] font-semibold text-slate-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                  <p className="text-[0.84rem] text-slate-700">{edu.institution}</p>
                </div>
                <span className="text-[0.78rem] text-slate-500">{formatDate(edu.graduation_date)}</span>
              </div>
              {edu.gpa && <p className="text-[0.78rem] text-slate-500">CGPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      </section>
    ) : null
  )

  const CertificationsBlock = () => (
    certifications.length > 0 ? (
      <section>
        <SectionTitle accentColor={accentColor}>Certifications</SectionTitle>
        <div className="space-y-3">
          {certifications.map((certificate, index) => {
            const certificateName = typeof certificate === 'string' ? certificate : certificate.certificate_name || certificate.name || certificate.title || certificate.description
            const issuer = typeof certificate === 'string' ? '' : certificate.issuer || certificate.organization
            const issueDate = typeof certificate === 'string' ? '' : formatDate(certificate.issue_date || certificate.date)
            const credentialUrl = typeof certificate === 'string' ? '' : certificate.credential_url || certificate.url

            return (
              <div key={certificate._id || index}>
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <h3 className="text-[0.88rem] font-semibold text-slate-900">{certificateName}</h3>
                    <MetaLine items={[issuer, issueDate]} />
                  </div>
                  {credentialUrl && (
                    <a href={credentialUrl} target="_blank" rel="noreferrer" className="text-[0.78rem] font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-slate-900">
                      View Credential
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    ) : null
  )

  const AchievementsBlock = () => (
    achievements.length > 0 ? (
      <section>
        <SectionTitle accentColor={accentColor}>Achievements</SectionTitle>
        <div className="space-y-3">
          {achievements.map((achievement, index) => {
            const title = typeof achievement === 'string' ? achievement : achievement.title || achievement.name
            const organization = typeof achievement === 'string' ? '' : achievement.organization
            const date = typeof achievement === 'string' ? '' : formatDate(achievement.date)
            const proofUrl = typeof achievement === 'string' ? '' : achievement.proof_url || achievement.url

            return (
              <div key={achievement._id || index}>
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <h3 className="text-[0.88rem] font-semibold text-slate-900">{title}</h3>
                    <MetaLine items={[organization, date]} />
                  </div>
                  {proofUrl && (
                    <a href={proofUrl} target="_blank" rel="noreferrer" className="text-[0.78rem] font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-slate-900">
                      Proof
                    </a>
                  )}
                </div>
                {typeof achievement !== 'string' && achievement.description && <p className="mt-1 text-[0.84rem] leading-5 text-slate-700">{achievement.description}</p>}
              </div>
            )
          })}
        </div>
      </section>
    ) : null
  )

  const ActivitiesBlock = () => (
    activities.length > 0 ? (
      <section>
        <SectionTitle accentColor={accentColor}>Extracurricular Activities</SectionTitle>
        <div className="space-y-3">
          {activities.map((activity, index) => {
            const activityName = typeof activity === 'string' ? activity : activity.activity || activity.name || activity.title
            const organization = typeof activity === 'string' ? '' : activity.organization
            const position = typeof activity === 'string' ? '' : activity.position
            const dateRange = typeof activity === 'string' ? '' : formatRange(activity.start_date, activity.end_date, false)
            const externalUrl = typeof activity === 'string' ? '' : activity.url

            return (
              <div key={activity._id || index}>
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <h3 className="text-[0.88rem] font-semibold text-slate-900">{activityName}</h3>
                    <MetaLine items={[position, organization, dateRange]} />
                  </div>
                  {externalUrl && (
                    <a href={externalUrl} target="_blank" rel="noreferrer" className="text-[0.78rem] font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-slate-900">
                      View
                    </a>
                  )}
                </div>
                {typeof activity !== 'string' && activity.description && <p className="mt-1 text-[0.84rem] leading-5 text-slate-700">{activity.description}</p>}
              </div>
            )
          })}
        </div>
      </section>
    ) : null
  )

  const ExperienceBlock = () => (
    experience.length > 0 ? (
      <section>
        <SectionTitle accentColor={accentColor}>Experience</SectionTitle>
        <div className="space-y-4">
          {experience.map((exp, index) => (
            <div key={exp._id || index}>
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <h3 className="text-[0.92rem] font-semibold text-slate-900">{exp.position || exp.role}</h3>
                  <p className="text-[0.84rem] font-medium text-slate-700">{exp.company}</p>
                  <MetaLine items={[exp.location, exp.employment_type]} />
                </div>
                <span className="text-[0.78rem] text-slate-500">{formatRange(exp.start_date, exp.end_date, exp.is_current || /^(present|current)$/i.test(String(exp.end_date || '')))}</span>
              </div>
              {exp.description && <RenderBullets value={exp.description} />}
            </div>
          ))}
        </div>
      </section>
    ) : null
  )

  const ProjectsBlock = () => (
    projects.length > 0 ? (
      <section>
        <SectionTitle accentColor={accentColor}>Projects</SectionTitle>
        <div className="space-y-4">
          {projects.map((project, index) => (
            <div key={project._id || index}>
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <h3 className="text-[0.92rem] font-semibold text-slate-900">{project.name}</h3>
                  <MetaLine items={[project.tech_stack || project.type, formatRange(project.start_date, project.end_date, false)]} />
                </div>
                {project.github_url || project.live_url || project.preview_url ? renderProjectLinks(project) : null}
              </div>
              {project.description && <RenderBullets value={project.description} />}
            </div>
          ))}
        </div>
      </section>
    ) : null
  )

  const SummaryBlock = () =>
    data.professional_summary ? (
      <section>
        <SectionTitle accentColor={accentColor}>Professional Summary</SectionTitle>
        <p className="text-[0.84rem] leading-5 text-slate-700">{data.professional_summary}</p>
      </section>
    ) : null

  if (layout === 'split') {
    return (
      <div className="grid gap-0 md:grid-cols-[1.25fr_0.75fr]">
        <main className="space-y-5 px-6 py-6 md:px-8 md:py-7">
          <SummaryBlock />
          <ExperienceBlock />
          <ProjectsBlock />
        </main>

        <aside className="space-y-5 border-t border-slate-100 bg-slate-50 px-6 py-6 md:border-l md:border-t-0 md:px-6 md:py-7">
          <section>
            <SectionTitle accentColor={accentColor}>Contact</SectionTitle>
            <p className="text-[0.84rem] leading-5 text-slate-700">{getContactLine(personalInfo)}</p>
            {personalInfo.linkedin && <p className="mt-1 text-[0.82rem] text-slate-600">LinkedIn: {formatUrlLabel(personalInfo.linkedin)}</p>}
            {personalInfo.website && <p className="text-[0.82rem] text-slate-600">Portfolio: {formatUrlLabel(personalInfo.website)}</p>}
          </section>

          <SkillsBlock />
          <EducationBlock />
          <CertificationsBlock />
          <AchievementsBlock />
          <ActivitiesBlock />
        </aside>
      </div>
    )
  }

  return (
    <div className="space-y-5 px-6 py-6 md:px-8 md:py-7">
      <SummaryBlock />
      <ExperienceBlock />
      <ProjectsBlock />
      <EducationBlock />
      <SkillsBlock />
      <CertificationsBlock />
      <AchievementsBlock />
      <ActivitiesBlock />
    </div>
  )
}

export default TemplateContent
