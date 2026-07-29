import React from 'react'
import SectionListEditor from './SectionListEditor'

const ExperienceForm = ({ data, onChange }) => {
    return (
        <SectionListEditor
            title="Professional Experience"
            description="Use concise bullet-ready descriptions and keep each role compact."
            data={data}
            onChange={onChange}
            itemLabel="Experience"
            addLabel="Add Experience"
            emptyTitle="No work experience added yet"
            emptyDescription="Add your most relevant roles first."
            createItem={() => ({ company: '', position: '', location: '', employment_type: '', start_date: '', end_date: '', is_current: false, description: '' })}
            getItemSummary={(item) => [item.position, item.company].filter(Boolean).join(' • ')}
            fields={[
                { key: 'position', label: 'Role', placeholder: 'Senior Software Engineer', fullWidth: true },
                { key: 'company', label: 'Company', placeholder: 'Example Corp' },
                { key: 'location', label: 'Location', placeholder: 'New York, NY' },
                { key: 'employment_type', label: 'Employment Type', placeholder: 'Full-time' },
                { key: 'start_date', label: 'Start Date', type: 'month', placeholder: '2023-01' },
                { key: 'end_date', label: 'End Date', type: 'month', placeholder: '2025-01' },
                { key: 'is_current', label: 'Currently working here', type: 'checkbox' },
                { key: 'description', label: 'Description', type: 'textarea', rows: 4, placeholder: 'Write compact bullet-ready achievements and responsibilities.', fullWidth: true },
            ]}
        />
    )
}

export default ExperienceForm