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
    const { candidateId, problem, difficulty, durationMinutes } = req.body;
    const hostUser = req.user;

    if (!candidateId || !problem || !difficulty) {
      return res.status(400).json({ message: "Candidate ID, problem, and difficulty are required." });
    }

    // 1. Validate Candidate exists
    const candidateUser = await User.findOne({ candidateId: candidateId.trim().toUpperCase() });
    if (!candidateUser) {
      return res.status(404).json({ message: `Candidate with ID "${candidateId}" does not exist.` });
    }

    // 2. Generate unique identifiers
    const interviewId = generateInterviewId();
    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // 3. Create Session in MongoDB
    const session = await Session.create({
      interviewId,
      problem,
      difficulty,
      host: hostUser._id,
      participant: candidateUser._id,
      candidateId: candidateUser.candidateId,
      status: "active",
      callId,
      durationMinutes: durationMinutes || 45,
    });

    // 4. Create Stream Video Call
    try {
      await streamClient.video.call("default", callId).getOrCreate({
        data: {
          created_by_id: hostUser.clerkId,
          custom: { problem, difficulty, sessionId: session._id.toString() },
        },
      });

      // Create Stream Messaging Channel
      const channel = chatClient.channel("messaging", callId, {
        name: `${problem} Session`,
        created_by_id: hostUser.clerkId,
        members: [hostUser.clerkId, candidateUser.clerkId],
      });
      await channel.create();
    } catch (e) {
      console.log("Stream creation non-fatal error:", e.message);
    }

    // 5. Create MongoDB Notification for Candidate
    const notification = await Notification.create({
      recipient: candidateUser._id,
      sender: hostUser._id,
      interview: session._id,
      title: "New Technical Interview Invitation",
      message: `${hostUser.name} invited you to a live ${difficulty.toUpperCase()} technical interview for "${problem}".`,
      type: "invitation",
    });

    // 6. Log Activity in MongoDB
    await Activity.create({
      userId: hostUser._id,
      action: "INTERVIEW_CREATED",
      details: `Created interview ${interviewId} with candidate ${candidateUser.candidateId} for problem ${problem}`,
      metadata: { sessionId: session._id },
    });

    res.status(201).json({
      session,
      notification,
      candidate: {
        name: candidateUser.name,
        email: candidateUser.email,
        candidateId: candidateUser.candidateId,
      },
      message: `Interview created and notification sent to ${candidateUser.name}`,
    });
  } catch (error) {
    console.error("createInterviewByCandidateId error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getCandidateInterviews(req, res) {
  try {
    const candidateId = req.user._id;

    const sessions = await Session.find({
      $or: [{ participant: candidateId }, { host: candidateId }],
    })
      .populate("host", "name profileImage email clerkId candidateId")
      .populate("participant", "name profileImage email clerkId candidateId")
      .sort({ createdAt: -1 });

    res.status(200).json({ sessions });
  } catch (error) {
    console.error("getCandidateInterviews error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getHostInterviews(req, res) {
  try {
    const hostId = req.user._id;

    const sessions = await Session.find({ host: hostId })
      .populate("host", "name profileImage email clerkId candidateId")
      .populate("participant", "name profileImage email clerkId candidateId")
      .sort({ createdAt: -1 });

    res.status(200).json({ sessions });
  } catch (error) {
    console.error("getHostInterviews error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
