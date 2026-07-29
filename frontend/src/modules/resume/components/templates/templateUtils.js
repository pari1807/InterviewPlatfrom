export const formatDate = (dateStr) => {
    if (!dateStr) return ''

    const normalizedValue = String(dateStr).trim()
    if (!normalizedValue) return ''
    if (/^(present|current)$/i.test(normalizedValue)) return 'Present'

    if (normalizedValue.includes('-')) {
        const [year, month] = normalizedValue.split('-')
        const parsedDate = new Date(Number(year), Number(month) - 1)
        if (!Number.isNaN(parsedDate.getTime())) {
            return parsedDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
            })
        }
    }

    const fallbackDate = new Date(normalizedValue)
    if (!Number.isNaN(fallbackDate.getTime())) {
        return fallbackDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
        })
    }

    return normalizedValue
}

export const toBulletList = (value) => {
    if (!value) return []

    if (Array.isArray(value)) {
        return value
            .map((item) => {
                if (typeof item === 'string') return item.trim()
                return item?.text || item?.name || item?.title || item?.description || ''
            })
            .filter(Boolean)
    }

    return String(value)
        .split(/\r?\n/)
        .map((line) => line.replace(/^[•\-\u2022]\s*/, '').trim())
        .filter(Boolean)
}

export const formatRange = (startDate, endDate, isCurrent = false) => {
    const startLabel = formatDate(startDate)
    const endLabel = isCurrent ? 'Present' : formatDate(endDate)

    if (startLabel && endLabel) {
        return `${startLabel} – ${endLabel}`
    }

    return startLabel || endLabel || ''
}

export const getProjectEntries = (data = {}) => data.project || data.projects || []

export const getCertificationEntries = (data = {}) => data.certifications || data.certificates || []

export const getAchievementEntries = (data = {}) => data.achievements || []

export const getActivityEntries = (data = {}) => data.extracurricular_activities || data.extracurricularActivities || data.activities || []

export const formatUrlLabel = (url = '') => {
    if (!url) return ''

    try {
        const parsedUrl = new URL(url)
        const host = parsedUrl.hostname.replace(/^www\./i, '')
        return host || url
    } catch {
        return String(url).replace(/^https?:\/\//i, '').replace(/^www\./i, '')
    }
}

export const groupSkills = (skills = []) => {
    const groups = {
        Languages: [],
        Frameworks: [],
        Tools: [],
        Databases: [],
        Cloud: [],
        Other: [],
    }

    const languageKeywords = ['java', 'python', 'c++', 'c#', 'javascript', 'typescript', 'go', 'rust', 'php', 'ruby', 'kotlin', 'swift']
    const frameworkKeywords = ['react', 'node', 'next', 'express', 'vue', 'angular', 'django', 'flask', 'spring', 'laravel', 'tailwind']
    const toolKeywords = ['git', 'docker', 'kubernetes', 'figma', 'jira', 'linux', 'postman', 'webpack', 'vite', 'jest', 'redux', 'npm', 'yarn']
    const databaseKeywords = ['mongo', 'mongodb', 'postgres', 'mysql', 'redis', 'sql', 'sqlite']
    const cloudKeywords = ['aws', 'azure', 'gcp', 'google cloud', 'firebase', 'vercel', 'netlify']

    skills.forEach((skill) => {
        const value = typeof skill === 'string' ? skill.trim() : String(skill || '').trim()
        if (!value) return

        const lowerValue = value.toLowerCase()
        if (languageKeywords.some((keyword) => lowerValue.includes(keyword))) {
            groups.Languages.push(value)
            return
        }

        if (frameworkKeywords.some((keyword) => lowerValue.includes(keyword))) {
            groups.Frameworks.push(value)
            return
        }

        if (databaseKeywords.some((keyword) => lowerValue.includes(keyword))) {
            groups.Databases.push(value)
            return
        }

        if (cloudKeywords.some((keyword) => lowerValue.includes(keyword))) {
            groups.Cloud.push(value)
            return
        }

        if (toolKeywords.some((keyword) => lowerValue.includes(keyword))) {
            groups.Tools.push(value)
            return
        }

        groups.Other.push(value)
    })

    return Object.entries(groups)
        .map(([label, values]) => ({ label, values }))
        .filter((group) => group.values.length > 0)
}

export const getContactLine = (personalInfo = {}) => {
    const parts = [
        personalInfo.phone,
        personalInfo.email,
        personalInfo.linkedin,
        personalInfo.website,
        personalInfo.location,
    ]
        .map((part) => (part ? String(part).trim() : ''))
        .filter(Boolean)

    return parts.join(' · ')
}

export const DEFAULT_LAYOUT_SETTINGS = {
    layoutMode: 'compact',
    fontScale: 1,
    headingScale: 1,
    lineSpacing: 1.32,
    sectionSpacing: 1,
    pageMargin: 0.45,
}

export const buildPreviewVars = (settings = DEFAULT_LAYOUT_SETTINGS) => ({
    '--resume-font-scale': settings.fontScale,
    '--resume-heading-scale': settings.headingScale,
    '--resume-line-spacing': settings.lineSpacing,
    '--resume-section-spacing': settings.sectionSpacing,
    '--resume-page-margin': `${settings.pageMargin}in`,
})
