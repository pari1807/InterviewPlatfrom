import User from "../models/User.js";
import Activity from "../models/Activity.js";

export async function getCurrentUser(req, res) {
  try {
    const user = req.user;
    res.status(200).json({ user });
  } catch (error) {
    console.error("getCurrentUser error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function setUserRole(req, res) {
  try {
    const { role } = req.body;

    if (!["host", "candidate"].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be host or candidate." });
    }

    const user = await User.findById(req.user._id);
    user.role = role;
    await user.save();

    await Activity.create({
      userId: user._id,
      action: "ROLE_SELECTED",
      details: `Selected application role: ${role}`,
    });

    res.status(200).json({ user, message: `Role set to ${role} successfully` });
  } catch (error) {
    console.error("setUserRole error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function findCandidateById(req, res) {
  try {
    const { candidateId } = req.params;

    const candidate = await User.findOne({
      candidateId: candidateId.trim().toUpperCase(),
    }).select("name email profileImage clerkId candidateId role createdAt");

    if (!candidate) {
      return res.status(404).json({ message: `Candidate with ID ${candidateId} not found.` });
    }

    res.status(200).json({ candidate });
  } catch (error) {
    console.error("findCandidateById error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getAllCandidates(req, res) {
  try {
    const candidates = await User.find({ role: "candidate" })
      .select("name email profileImage clerkId candidateId createdAt")
      .sort({ createdAt: -1 })
      .limit(30);

    res.status(200).json({ candidates });
  } catch (error) {
    console.error("getAllCandidates error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
