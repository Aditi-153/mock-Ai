import OpenAI from "openai";
import { z } from "zod";

const ai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const resultSchema = z.object({
  feedback: z.string(),
  score: z.number().int().min(0).max(10),

  questionEvaluations: z.array(
    z.object({
      questionIndex: z.number().int().min(0),
      score: z.number().int().min(0).max(10),
      feedback: z.string(),
    }),
  ),

  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  suggestions: z.array(z.string()),
});

const RESULT_PROMPT = `
You are an expert technical interviewer.

Evaluate the candidate's complete interview transcript.

The transcript contains interview questions and candidate answers.

Return:
1. Overall feedback about the candidate's performance.
2. An overall score from 0 to 10.
3. An evaluation for every question answered.
4. Strengths of the candidate.
5. Weaknesses of the candidate.
6. Suggestions for improvement.

For each question evaluation, return:
- questionIndex: zero-based index of the question, starting from 0.
- score: integer from 0 to 10.
- feedback: specific feedback about the answer.

Evaluation rules:
- Evaluate technical correctness, clarity, relevance, and completeness.
- Do not give high scores to incorrect or incomplete answers.
- Use the same order as the transcript.
- Include one evaluation for every interview question.
- Do not invent answers that the candidate did not provide.
- Overall score must be an integer from 0 to 10.
- Return valid JSON only.

Required JSON format:
{
  "feedback": "Overall interview feedback",
  "score": 7,
  "questionEvaluations": [
    {
      "questionIndex": 0,
      "score": 8,
      "feedback": "Question-specific feedback"
    }
  ],
  "strengths": ["Strength 1"],
  "weaknesses": ["Weakness 1"],
  "suggestions": ["Suggestion 1"]
}
`;

export const calculateResult = async (messages) => {
  const response = await ai.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content: RESULT_PROMPT,
      },
      {
        role: "user",
        content: JSON.stringify(messages),
      },
    ],
    response_format: {
      type: "json_object",
    },
  });

  const content = response.choices[0].message.content;

  const result = resultSchema.parse(JSON.parse(content));

  return result;
};
