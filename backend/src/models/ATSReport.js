import mongoose from "mongoose";

const ATSReportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    clerkId: { type: String, required: true, index: true },
    puterUserId: { type: String, default: "" },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" },
    companyName: { type: String, default: "Target Company" },
    jobTitle: { type: String, default: "Target Role" },
    jobDescription: { type: String, required: true },
    imageDataUrl: { type: String, default: "" },
    imagePath: { type: String, default: "" },
    resumePath: { type: String, default: "" },
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
