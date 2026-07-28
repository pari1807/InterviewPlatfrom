import { analyzeCodePerformance } from "../agents/codingAgent.js";
import { generateInterviewFeedback } from "../agents/feedbackAgent.js";
import { expandHostNotes } from "../agents/hostAssistanceAgent.js";
import { monitorLiveInterview } from "../agents/monitoringAgent.js";
import AIEvaluation from "../models/AIEvaluation.js";
import Session from "../models/Session.js";

export async function handleAnalyzeCode(req, res) {
  try {
    const { code, language, problemTitle, problemDescription } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Code string is required" });
    }

    const analysis = await analyzeCodePerformance({
      code,
      language: language || "javascript",
      problemTitle,
      problemDescription,
    });

    res.status(200).json({ analysis });
  } catch (error) {
    console.error("handleAnalyzeCode error:", error.message);
    res.status(500).json({ message: "AI Code Analysis Failed" });
  }
}

export async function handleExpandRubric(req, res) {
  try {
    const { sessionId, rawNotes, problemTitle, difficulty } = req.body;

    if (!rawNotes) {
      return res.status(400).json({ message: "Raw notes are required" });
    }

    const rubric = await expandHostNotes({
      problemTitle: problemTitle || "Coding Problem",
      difficulty: difficulty || "Medium",
      rawNotes,
    });

    if (sessionId) {
      await Session.findByIdAndUpdate(sessionId, { hostNotes: rawNotes, rubric });
    }

    res.status(200).json({ rubric });
  } catch (error) {
    console.error("handleExpandRubric error:", error.message);
    res.status(500).json({ message: "Host Rubric Expansion Failed" });
  }
}

export async function handleGenerateFeedback(req, res) {
  try {
    const { sessionId, problemTitle, difficulty, code, language, hostNotes, durationMinutes } = req.body;

    const feedback = await generateInterviewFeedback({
      problemTitle: problemTitle || "Technical Screen",
      difficulty: difficulty || "Medium",
      code,
      language: language || "javascript",
      hostNotes,
      durationMinutes,
    });

    if (sessionId && req.user?._id) {
      await AIEvaluation.findOneAndUpdate(
        { sessionId },
        {
          sessionId,
          candidateId: req.user._id,
          overallScore: feedback.overallScore,
          communicationScore: feedback.communicationScore,
          confidenceScore: feedback.confidenceScore,
          technicalScore: feedback.technicalScore,
          problemSolvingScore: feedback.problemSolvingScore,
          explanationQualityScore: feedback.explanationQualityScore,
          summary: feedback.summary,
          strengths: feedback.strengths,
          weaknesses: feedback.weaknesses,
          suggestions: feedback.suggestions,
          roadmap: feedback.roadmap,
        },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ feedback });
  } catch (error) {
    console.error("handleGenerateFeedback error:", error.message);
    res.status(500).json({ message: "Interview Feedback Generation Failed" });
  }
}

export async function handleMonitorLive(req, res) {
  try {
    const { code, language, problemTitle, elapsedMinutes } = req.body;

    const liveData = await monitorLiveInterview({
      code,
      language: language || "javascript",
      problemTitle,
      elapsedMinutes,
    });

    res.status(200).json({ liveData });
  } catch (error) {
    console.error("handleMonitorLive error:", error.message);
    res.status(500).json({ message: "Live Monitoring Failed" });
  }
}

export async function getEvaluationBySession(req, res) {
  try {
    const { sessionId } = req.params;
    const evaluation = await AIEvaluation.findOne({ sessionId });
    res.status(200).json({ evaluation });
  } catch (error) {
    console.error("getEvaluationBySession error:", error.message);
    res.status(500).json({ message: "Failed to fetch evaluation" });
  }
}
