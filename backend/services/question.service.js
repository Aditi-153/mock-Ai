import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const questionSchema = z.object({
  questions: z.array(z.string()).min(1),
});

const QUESTION_PROMPT = `
You are an expert technical interviewer.

Generate 5 interview questions for:

Role: {{ROLE}}
Experience: {{EXPERIENCE}}
Difficulty: {{DIFFICULTY}}
Interview Type: {{INTERVIEW_TYPE}}

Requirements:
- Questions must be relevant to the role.
- Match the experience level.
- Match the difficulty.
- Match the interview type.
- Do not provide answers.

Return ONLY valid JSON:

{
  "questions": [
    "Question 1",
    "Question 2",
    "Question 3",
    "Question 4",
    "Question 5"
  ]
}
`;

export const generateQuestions = async ({
  role,
  experience,
  difficulty,
  interviewType,
}) => {
  const prompt = QUESTION_PROMPT
    .replace("{{ROLE}}", role)
    .replace("{{EXPERIENCE}}", experience)
    .replace("{{DIFFICULTY}}", difficulty)
    .replace("{{INTERVIEW_TYPE}}", interviewType);

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: prompt,
  });

  const result = JSON.parse(response.text);

  return questionSchema.parse(result);
};