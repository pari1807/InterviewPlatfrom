import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    interviewId: {
      type: String,
      unique: true,
      sparse: true,
    },
    problem: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    secondaryProblem: {
      type: String,
      default: "",
    },
    secondaryDifficulty: {
      type: String,
      default: "",
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    candidateId: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["scheduled", "active", "completed", "cancelled"],
      default: "active",
    },
    callId: {
      type: String,
      default: "",
    },
    scheduledAt: {
      type: Date,
      default: Date.now,
    },
    durationMinutes: {
      type: Number,
      default: 45,
    },
    hostNotes: {
      type: String,
      default: "",
    },
    rubric: {
      type: Object,
      default: null,
    },
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
