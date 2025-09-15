import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function parseResume(text) {
  const prompt = `You are a resume parsing assistant. Extract skills, education, projects, and experience from the following resume text and return a JSON object like:
  {
    "skills": [...],
    "education": [...],
    "projects": [...],
    "experience": [...]
  }\n\nResume:\n${text}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a professional resume parser." },
      { role: "user", content: prompt }
    ]
  });

  const output = response.choices[0].message.content;
  return JSON.parse(output);
}
