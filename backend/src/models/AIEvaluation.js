import mongoose from "mongoose";

const aiEvaluationSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    overallScore: { type: Number, default: 85 },
    communicationScore: { type: Number, default: 85 },
    confidenceScore: { type: Number, default: 85 },
    technicalScore: { type: Number, default: 85 },
    problemSolvingScore: { type: Number, default: 85 },
    explanationQualityScore: { type: Number, default: 85 },
    summary: { type: String, default: "" },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    suggestions: [{ type: String }],
    roadmap: [{ type: String }],
    timeComplexity: { type: String, default: "O(N)" },
    spaceComplexity: { type: String, default: "O(1)" },
  },
  { timestamps: true }
);

const AIEvaluation = mongoose.model("AIEvaluation", aiEvaluationSchema);

export default AIEvaluation;
