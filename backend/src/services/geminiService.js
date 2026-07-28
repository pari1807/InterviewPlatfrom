import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "../lib/env.js";

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY || "");

export const getGeminiModel = (modelName = "gemini-1.5-flash") => {
  return genAI.getGenerativeModel({ model: modelName });
};

/**
 * Helper to call Gemini model with prompt and return clean text or JSON
 */
export async function generateContent(prompt, systemInstruction = "") {
  try {
    const model = getGeminiModel();
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt }] }],
    });
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error.message);
    throw error;
  }
}

/**
 * Call Gemini model and parse JSON output safely
 */
export async function generateJSON(prompt, systemInstruction = "") {
  try {
    const rawText = await generateContent(
      `${prompt}\n\nIMPORTANT: Respond ONLY with valid JSON. Do not include markdown code block formatting like \`\`\`json or \`\`\`.`,
      systemInstruction
    );

    const cleaned = rawText
      .replace(/^```json/g, "")
      .replace(/^```/g, "")
      .replace(/```$/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Error parsing Gemini JSON output:", error.message);
    // Fallback object if JSON parsing fails
    return null;
  }
}
