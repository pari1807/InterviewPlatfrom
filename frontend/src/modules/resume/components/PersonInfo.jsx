import { BriefcaseBusiness, Globe, Mail, MapPin, Phone, User } from 'lucide-react'
import { FaLinkedin } from 'react-icons/fa'
import React from 'react'

const PersonInfo = ({data, onChange, removeBackground, setRemoveBackground}) => {

    const handleChange = (field, value) => {
        onChange({...data, [field]: value})
    }

    const fields = [
        {key: "full_name", label: "Full Name", icon: User, type: "text", required: true},
        {key: "email", label: "Email Address", icon: Mail, type: "email", required: true},
        {key: "phone", label: "Phone Number", icon: Phone, type: "tel"},
        {key: "location", label: "Location", icon: MapPin, type: "text"},
        {key: "profession", label: "Profession", icon: BriefcaseBusiness, type: "text"},
        {key: "linkedin", label: "LinkedIn Profile", icon: FaLinkedin, type: "url"},
        {key: "website", label: "Personal website", icon: Globe, type: "url"},
    ]
  return (
    <div className="space-y-5">
        <div>
            <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
            <p className="text-sm text-slate-500">Keep this section compact and recruiter-friendly.</p>
        </div>

        <div className='flex flex-wrap items-center gap-3'>
            <label>
                {data.image ? (
                    <img
                        src={typeof data.image === 'string' ? data.image : (data.image instanceof Blob || data.image instanceof File) ? URL.createObjectURL(data.image) : (data.image?.default || '')}
                        alt="user-image"
                        className='h-16 w-16 rounded-full object-cover ring ring-emerald-200 hover:opacity-80'
                    />
                ) : (
                    <div className ='inline-flex items-center gap-2 rounded-full border border-dashed border-emerald-200 px-4 py-3 text-emerald-700 hover:text-emerald-800 cursor-pointer'>
                        <User className ='size-8 rounded-full border border-emerald-200 p-2' />
                        <span>Upload user image</span>
                    </div>
                )}

                <input type="file" accept="image/*" className='hidden' onChange={(e) => handleChange("image", e.target.files?.[0])} />
            </label>
            {(data.image instanceof Blob || data.image instanceof File) && (
                <div className = 'flex flex-col gap-1 text-sm text-slate-600'>
                    <p>Remove background</p>
                    <label className = "relative inline-flex items-center cursor-pointer text-slate-900 gap-3">
                        <input type="checkbox" className='sr-only peer' onChange={() => setRemoveBackground(prev => !prev)} checked={removeBackground} />
                        <div className = 'w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-emerald-600 transition-colors duration-200'></div>
                        <span className = 'dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4'></span>
                    </label>
                </div>
            )}
        </div>

          {fields.map((field) => {
            const Icon = field.icon;
            return (
                <div key={field.key} className='space-y-1'>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <Icon className="size-4" />
                        {field.label}
                        {field.required && <span className = "text-red-500">*</span>}
                    </label>
                    <input type ={field.type} value = {data[field.key] || ""} onChange={(e) => handleChange(field.key, e.target.value)} className = 'mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100' placeholder = {`Enter your ${field.label.toLowerCase()}`} required={field.required} />
                </div>
            )
          })}  

    </div>
  )
}

export default PersonInfo