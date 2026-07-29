import React from 'react'
import SectionListEditor from './SectionListEditor'

const AchievementForm = ({ data, onChange }) => {
    return (
        <SectionListEditor
            title="Achievements"
            description="Add concise accomplishments with measurable impact where possible."
            data={data}
            onChange={onChange}
            itemLabel="Achievement"
            addLabel="Add Achievement"
            emptyTitle="No achievements added yet"
            emptyDescription="Add awards, recognitions, or notable wins."
            createItem={() => ({ title: '', organization: '', date: '', description: '', proof_url: '' })}
            getItemSummary={(item) => [item.title, item.organization].filter(Boolean).join(' • ')}
            fields={[
                { key: 'title', label: 'Title', placeholder: 'Best Engineer Award', fullWidth: true },
                { key: 'organization', label: 'Organization', placeholder: 'Acme Corp' },
                { key: 'date', label: 'Date', type: 'month', placeholder: '2025-01' },
                { key: 'description', label: 'Description', type: 'textarea', rows: 3, placeholder: 'One short line describing the achievement.', fullWidth: true },
                { key: 'proof_url', label: 'Proof URL (optional)', type: 'url', placeholder: 'https://...', fullWidth: true },
            ]}
        />
    )
}

export default AchievementForm