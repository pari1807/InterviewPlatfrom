import React from 'react'
import SectionListEditor from './SectionListEditor'

const ProjectForm = ({ data, onChange }) => {
    return (
        <SectionListEditor
            title="Projects"
            description="Keep project entries compact and highlight the technologies used."
            data={data}
            onChange={onChange}
            itemLabel="Project"
            addLabel="Add Project"
            emptyTitle="No projects added yet"
            emptyDescription="Include only the projects that reinforce your target role."
            createItem={() => ({ name: '', tech_stack: '', start_date: '', end_date: '', github_url: '', live_url: '', description: '' })}
            getItemSummary={(item) => [item.name, item.tech_stack].filter(Boolean).join(' • ')}
            fields={[
                { key: 'name', label: 'Project Name', placeholder: 'Realtime Analytics Dashboard', fullWidth: true },
                { key: 'tech_stack', label: 'Tech Stack', placeholder: 'React, Node.js, MongoDB' },
                { key: 'start_date', label: 'Start Date', type: 'month', placeholder: '2024-01' },
                { key: 'end_date', label: 'End Date', type: 'month', placeholder: '2024-12' },
                { key: 'github_url', label: 'GitHub URL', type: 'url', placeholder: 'https://github.com/...', fullWidth: true },
                { key: 'live_url', label: 'Live Demo URL', type: 'url', placeholder: 'https://...', fullWidth: true },
                { key: 'description', label: 'Description', type: 'textarea', rows: 4, placeholder: 'Summarize impact, scope, and results in bullet-friendly language.', fullWidth: true },
            ]}
        />
    )
}

export default ProjectForm