import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["host", "candidate", "pending"],
      default: "pending",
    },
    candidateId: {
      type: String,
      unique: true,
      sparse: true,
    },
    candidateKey: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

// Keep candidateId and candidateKey synchronized before saving
userSchema.pre("save", function (next) {
  if (this.candidateId && !this.candidateKey) {
    this.candidateKey = this.candidateId;
  } else if (this.candidateKey && !this.candidateId) {
    this.candidateId = this.candidateKey;
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
