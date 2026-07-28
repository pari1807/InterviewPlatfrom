import { generateJSON } from "../services/geminiService.js";

export async function expandHostNotes({ problemTitle, difficulty, rawNotes }) {
  const systemInstruction = `You are an AI Interview Co-Pilot & Host Assistant.
Your goal is to save the interviewer (host) time by expanding raw bullet notes into a structured evaluation rubric, follow-up questions, and scoring criteria.`;

  const prompt = `
Problem: ${problemTitle} (${difficulty})
Host Raw Notes: "${rawNotes}"

Expand these notes into a comprehensive interview rubric and return a JSON object strictly matching this schema:
{
  "detailedExplanation": "string",
  "expectedApproach": "string",
  "alternativeApproaches": ["string"],
  "evaluationRubric": {
    "excellent": "string",
    "acceptable": "string",
    "needsImprovement": "string"
  },
  "followUpQuestions": ["string"],
  "commonMistakes": ["string"],
  "hintsToProvide": ["string"]
}
`;

  try {
    const result = await generateJSON(prompt, systemInstruction);
    if (result) return result;
  } catch (err) {
    console.error("hostAssistanceAgent error:", err.message);
  }

  return {
    detailedExplanation: "Expanded rubric for problem evaluation.",
    expectedApproach: rawNotes || "Optimal hashing or two-pointer approach.",
    alternativeApproaches: ["Brute force O(N^2)", "Sorting + Two pointers O(N log N)"],
    evaluationRubric: {
      excellent: "Identifies O(N) approach instantly and handles all edge cases.",
      acceptable: "Solves problem within 30 mins with minor hints.",
      needsImprovement: "Struggles with time complexity optimization.",
    },
    followUpQuestions: ["How would you handle duplicate inputs?", "What if array cannot fit in memory?"],
    commonMistakes: ["Off-by-one array index error", "Ignoring null inputs"],
    hintsToProvide: ["Think about using a Hash Map to store previously seen elements."],
  };
}
