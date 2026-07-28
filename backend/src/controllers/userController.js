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
    const { search = "", page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build search filter
    const filter = { role: "candidate" };
    if (search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: regex },
        { email: regex },
        { candidateId: regex },
      ];
    }

    const [candidates, total] = await Promise.all([
      User.find(filter)
        .select("name email profileImage clerkId candidateId role createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      candidates,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error("getAllCandidates error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
