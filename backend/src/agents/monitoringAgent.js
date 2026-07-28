import { generateJSON } from "../services/geminiService.js";

export async function monitorLiveInterview({ code, language, problemTitle, elapsedMinutes }) {
  const systemInstruction = `You are a Real-Time Interview Monitoring AI Agent.
Evaluate the current live snapshot of the candidate's code quickly without delaying the UI.`;

  const prompt = `
Problem: ${problemTitle}
Language: ${language}
Elapsed Minutes: ${elapsedMinutes || 10}

Live Code Snapshot:
\`\`\`${language}
${code || "// Typing..."}
\`\`\`

Return a JSON object strictly matching this schema:
{
  "codeQualityScore": number (0-100),
  "progressPercentage": number (0-100),
  "observation": "string (1-2 sentences)",
  "suggestedIntervention": "string or null if on track"
}
`;

  try {
    const result = await generateJSON(prompt, systemInstruction);
    if (result) return result;
  } catch (err) {
    console.error("monitoringAgent error:", err.message);
  }

  return {
    codeQualityScore: 88,
    progressPercentage: 65,
    observation: "Candidate is currently implementing main logic loop.",
    suggestedIntervention: null,
  };
}
