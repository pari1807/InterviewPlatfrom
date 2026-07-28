import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import Activity from "../models/Activity.js";

function generateInterviewId() {
  const nums = Math.floor(10000 + Math.random() * 90000);
  return `INT-${nums}`;
}

export async function createInterviewByCandidateId(req, res) {
  try {
    const { candidateId, problem, difficulty, secondaryProblem, secondaryDifficulty, durationMinutes } = req.body;
    const hostUser = req.user;

    // Security check: only hosts can create live meetings!
    if (hostUser.role !== "host") {
      return res.status(403).json({ message: "Forbidden: Only users with the Host role can create live meetings." });
    }

    if (!candidateId || !problem || !difficulty) {
      return res.status(400).json({ message: "Candidate Key/Email, primary problem, and difficulty are required." });
    }

    const cleanKey = candidateId.trim();

    // 1. Validate Candidate exists by candidateId, candidateKey, email, or clerkId
    const candidateUser = await User.findOne({
      $or: [
        { candidateId: new RegExp(`^${cleanKey}$`, "i") },
        { candidateKey: new RegExp(`^${cleanKey}$`, "i") },
        { email: new RegExp(`^${cleanKey}$`, "i") },
        { clerkId: cleanKey },
      ],
    });

    if (!candidateUser) {
      return res.status(404).json({ message: `Candidate with Key/Email "${candidateId}" does not exist.` });
    }

    // 2. Generate unique identifiers
    const interviewId = generateInterviewId();
    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // 3. Create Session in MongoDB
    const session = await Session.create({
      interviewId,
      problem,
      difficulty,
      secondaryProblem: secondaryProblem || "",
      secondaryDifficulty: secondaryDifficulty || "",
      host: hostUser._id,
      participant: candidateUser._id,
      candidateId: candidateUser.candidateKey || candidateUser.candidateId,
      status: "active",
      callId,
      durationMinutes: durationMinutes || 45,
    });

    // 4. Create Stream Video Call
    try {
      await streamClient.video.call("default", callId).getOrCreate({
        data: {
          created_by_id: hostUser.clerkId,
          members: [
            { user_id: hostUser.clerkId, role: "call_member" },
            { user_id: candidateUser.clerkId, role: "call_member" },
          ],
        },
      });
    } catch (streamErr) {
      console.error("Stream Video Call Creation Error:", streamErr);
    }

    // 5. Create Stream Chat Channel
    try {
      const channel = chatClient.channel("messaging", callId, {
        created_by_id: hostUser.clerkId,
        members: [hostUser.clerkId, candidateUser.clerkId],
        name: `Interview: ${interviewId}`,
      });
      await channel.create();
    } catch (chatErr) {
      console.error("Stream Chat Creation Error:", chatErr);
    }

    // 6. Notify Candidate
    try {
      await Notification.create({
        recipient: candidateUser._id,
        sender: hostUser._id,
        title: "New Interview Invitation",
        message: `${hostUser.name} has scheduled a ${difficulty} live interview with you.`,
        type: "invitation",
        interview: session._id,
      });

      const io = req.app.get("io");
      if (io) {
        io.to(`user_${candidateUser.clerkId}`).emit("new_notification", {
          title: "New Interview Invitation",
          message: `${hostUser.name} has scheduled a ${difficulty} live interview with you.`,
          sessionId: session._id,
        });
      }
    } catch (notifyErr) {
      console.error("Notification Creation Error:", notifyErr);
    }

    // 7. Log Activity
    try {
      await Activity.create({
        userId: hostUser._id,
        action: "SESSION_CREATED",
        details: `Scheduled interview ${interviewId} for candidate ${candidateUser.name}`,
      });
    } catch (actErr) {
      console.error("Activity Logging Error:", actErr);
    }

    res.status(201).json({
      message: "Interview created successfully",
      session,
      callId,
      interviewId,
    });
  } catch (error) {
    console.error("createInterviewByCandidateId error:", error);
    res.status(500).json({ message: "Failed to create interview" });
  }
}

export async function getSession(req, res) {
  try {
    const { id } = req.params;
    const session = await Session.findById(id).populate("host participant", "name email profileImage clerkId candidateId role");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({ session });
  } catch (error) {
    console.error("getSession error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    session.status = "completed";
    session.completedAt = new Date();
    await session.save();

    await Activity.create({
      userId: req.user._id,
      action: "SESSION_ENDED",
      details: `Ended interview session ${session.interviewId}`,
    });

    res.status(200).json({ message: "Session ended successfully", session });
  } catch (error) {
    console.error("endSession error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getCandidateInterviews(req, res) {
  try {
    const candidateId = req.user._id;
    const interviews = await Session.find({ participant: candidateId })
      .populate("host", "name email profileImage clerkId candidateId role")
      .sort({ createdAt: -1 });
    res.status(200).json({ interviews });
  } catch (error) {
    console.error("getCandidateInterviews error:", error);
    res.status(500).json({ message: "Failed to fetch interviews" });
  }
}

export async function getHostInterviews(req, res) {
  try {
    const hostId = req.user._id;
    const interviews = await Session.find({ host: hostId })
      .populate("participant", "name email profileImage clerkId candidateId role")
      .sort({ createdAt: -1 });
    res.status(200).json({ interviews });
  } catch (error) {
    console.error("getHostInterviews error:", error);
    res.status(500).json({ message: "Failed to fetch interviews" });
  }
}
