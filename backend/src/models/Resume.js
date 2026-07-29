import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    clerkId: { type: String, required: true, index: true },
    title: { type: String, default: "Untitled Resume" },
    public: { type: Boolean, default: false },
    template: { type: String, default: "classic" },
    accentColor: { type: String, default: "#10b981" },
    accent_color: { type: String, default: "#10b981" },
    professional_summary: { type: String, default: "" },
    skills: [{ type: String }],
    personal_info: {
      image: { type: String, default: "" },
      full_name: { type: String, default: "" },
      profession: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    experience: [
      {
        company: { type: String },
        position: { type: String },
        location: { type: String },
        employment_type: { type: String },
        start_date: { type: String },
        end_date: { type: String },
        description: { type: String },
        is_current: { type: Boolean },
      },
    ],
    project: [
      {
        name: { type: String },
        tech_stack: { type: String },
        start_date: { type: String },
        end_date: { type: String },
        github_url: { type: String },
        live_url: { type: String },
        description: { type: String },
      },
    ],
    projects: [
      {
        name: { type: String },
        tech_stack: { type: String },
        start_date: { type: String },
        end_date: { type: String },
        github_url: { type: String },
        live_url: { type: String },
        description: { type: String },
      },
    ],
    education: [
      {
        institution: { type: String },
        degree: { type: String },
        field: { type: String },
        graduation_date: { type: String },
        gpa: { type: String },
        description: { type: String },
      },
    ],
    certifications: [
      {
        certificate_name: { type: String },
        issuer: { type: String },
        issue_date: { type: String },
        credential_url: { type: String },
      },
    ],
    achievements: [
      {
        title: { type: String },
        organization: { type: String },
        date: { type: String },
        description: { type: String },
        proof_url: { type: String },
      },
    ],
    extracurricular_activities: [
      {
        activity: { type: String },
        organization: { type: String },
        position: { type: String },
        start_date: { type: String },
        end_date: { type: String },
        description: { type: String },
        url: { type: String },
      },
    ],
  },
  { timestamps: true, minimize: false }
);

const Resume = mongoose.model("Resume", ResumeSchema);

export default Resume;
