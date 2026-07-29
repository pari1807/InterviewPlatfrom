import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "../lib/env.js";

export const getGeminiModel = (modelName = "gemini-2.5-flash", customApiKey = "") => {
  const key = customApiKey || process.env.RESUME_GEMINI_API_KEY || ENV.GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
  const instance = new GoogleGenerativeAI(key);
  return instance.getGenerativeModel({ model: modelName });
};

/**
 * Helper to call Gemini model with prompt and return clean text or JSON
 */
export async function generateContent(prompt, systemInstruction = "", customApiKey = "") {
  const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite"];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const model = getGeminiModel(modelName, customApiKey);
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt }] }],
      });
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.warn(`[geminiService] Model ${modelName} failed:`, error.message);
      lastError = error;
    }
  }

  console.error("Error calling Gemini API across all models:", lastError?.message);
  throw lastError;
}

/**
 * Call Gemini model and parse JSON output safely
 */
export async function generateJSON(prompt, systemInstruction = "", customApiKey = "") {
  try {
    const rawText = await generateContent(
      `${prompt}\n\nIMPORTANT: Respond ONLY with valid JSON. Do not include markdown code block formatting like \`\`\`json or \`\`\`.`,
      systemInstruction,
      customApiKey
    );

    const cleaned = rawText
      .replace(/^```json/g, "")
      .replace(/^```/g, "")
      .replace(/```$/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Error parsing Gemini JSON output:", error.message);
    return null;
  }
}
