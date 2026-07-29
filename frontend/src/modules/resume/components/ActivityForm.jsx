import React from 'react'
import SectionListEditor from './SectionListEditor'

const ActivityForm = ({ data, onChange }) => {
    return (
        <SectionListEditor
            title="Extracurricular Activities"
            description="Include volunteering, clubs, or leadership activities."
            data={data}
            onChange={onChange}
            itemLabel="Activity"
            addLabel="Add Activity"
            emptyTitle="No activities added yet"
            emptyDescription="Use this section only when it adds value to the resume."
            createItem={() => ({ activity: '', organization: '', position: '', start_date: '', end_date: '', description: '', url: '' })}
            getItemSummary={(item) => [item.activity, item.organization].filter(Boolean).join(' • ')}
            fields={[
                { key: 'activity', label: 'Activity', placeholder: 'Coding Club', fullWidth: true },
                { key: 'organization', label: 'Organization', placeholder: 'University Tech Society' },
                { key: 'position', label: 'Position', placeholder: 'President' },
                { key: 'start_date', label: 'Start Date', type: 'month', placeholder: '2024-01' },
                { key: 'end_date', label: 'End Date', type: 'month', placeholder: '2024-12' },
                { key: 'description', label: 'Description', type: 'textarea', rows: 3, placeholder: 'Brief line describing leadership or contribution.', fullWidth: true },
                { key: 'url', label: 'Optional URL', type: 'url', placeholder: 'https://...', fullWidth: true },
            ]}
        />
    )
}

export default ActivityForm