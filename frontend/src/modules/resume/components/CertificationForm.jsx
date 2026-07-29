import React from 'react'
import SectionListEditor from './SectionListEditor'

const CertificationForm = ({ data, onChange }) => {
    return (
        <SectionListEditor
            title="Certifications"
            description="Add certifications that strengthen ATS relevance."
            data={data}
            onChange={onChange}
            itemLabel="Certification"
            addLabel="Add Certification"
            emptyTitle="No certifications added yet"
            emptyDescription="Include optional certifications to show verified expertise."
            createItem={() => ({ certificate_name: '', issuer: '', issue_date: '', credential_url: '' })}
            getItemSummary={(item) => [item.certificate_name, item.issuer].filter(Boolean).join(' • ')}
            fields={[
                { key: 'certificate_name', label: 'Certificate Name', placeholder: 'AWS Certified Developer', fullWidth: true },
                { key: 'issuer', label: 'Issuer', placeholder: 'Amazon Web Services' },
                { key: 'issue_date', label: 'Issue Date', type: 'month', placeholder: '2025-01' },
                { key: 'credential_url', label: 'Credential URL', type: 'url', placeholder: 'https://...', fullWidth: true },
            ]}
        />
    )
}

export default CertificationForm