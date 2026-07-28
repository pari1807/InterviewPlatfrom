import mongoose from "mongoose";

const codeSnapshotSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: { type: String, required: true },
    language: { type: String, default: "javascript" },
    output: { type: String, default: "" },
    passed: { type: Boolean, default: false },
    aiAnalysis: { type: Object, default: null },
  },
  { timestamps: true }
);

const CodeSnapshot = mongoose.model("CodeSnapshot", codeSnapshotSchema);

export default CodeSnapshot;
