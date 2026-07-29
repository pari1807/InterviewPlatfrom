import mongoose from "mongoose";

const ATSReportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    clerkId: { type: String, required: true, index: true },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" },
    jobTitle: { type: String, default: "" },
    jobDescription: { type: String, required: true },
    matchScore: { type: Number, default: 0 },
    overallAssessment: { type: String, default: "" },
    matchedKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],
    strengths: [{ type: String }],
    improvements: [{ type: String }],
    atsFormattingChecks: {
      type: Map,
      of: String,
    },
  },
  { timestamps: true }
);

const ATSReport = mongoose.model("ATSReport", ATSReportSchema);

export default ATSReport;
