import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const resultSchema = z.object({
  feedback: z.string(),
  score: z.number().int().min(0).max(10),
});

const RESULT_PROMPT = `
You are an expert technical interviewer and evaluator.

Evaluate the user's interview transcript.

Give:
1. An overall score from 0 to 10.
2. Clear and useful feedback about the user's performance.

Consider:
- Technical knowledge
- Accuracy of answers
- Communication
- Understanding of concepts
- Quality of explanations

Return ONLY valid JSON in this format:

{
  "feedback": "your feedback here",
  "score": 7
}

Do not return markdown.
Do not return explanations outside the JSON.

Interview transcript:

`;

export const calculateResult = async (messages) => {
  const prompt = RESULT_PROMPT + JSON.stringify(messages);

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: prompt,
  });

  const result = JSON.parse(response.text);

  return resultSchema.parse(result);
};
