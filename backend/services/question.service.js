import OpenAI from "openai";
import { z } from "zod";

const ai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const questionSchema = z.object({
  questions: z.array(z.string().trim().min(1)).length(5),
});

const QUESTION_PROMPT = `
You are an expert technical interviewer.

Generate exactly 5 interview questions.

Role: {{ROLE}}
Experience: {{EXPERIENCE}}
Difficulty: {{DIFFICULTY}}
Interview Type: {{INTERVIEW_TYPE}}

Requirements:
- Questions must match the role and experience.
- Follow the specified difficulty and interview type.
- Do not provide answers.
- Avoid duplicate questions.
- Return valid JSON in this format:
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
  const prompt = QUESTION_PROMPT.replace("{{ROLE}}", role)
    .replace("{{EXPERIENCE}}", experience)
    .replace("{{DIFFICULTY}}", difficulty)
    .replace("{{INTERVIEW_TYPE}}", interviewType);

  const response = await ai.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content: "Generate exactly 5 interview questions as valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: {
      type: "json_object",
    },
  });

  const content = response.choices[0].message.content;

  const result = questionSchema.parse(JSON.parse(content));

  return result;
};
