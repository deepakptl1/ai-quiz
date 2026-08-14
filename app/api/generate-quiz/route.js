import { NextResponse } from "next/server";
import { askAIForJSON } from "@/lib/ai";

export async function POST(request) {
  const body = await request.json();
  const { topic, difficulty, numQuestions } = body;

  if (!topic || typeof topic !== "string" || !topic.trim()) {
    return NextResponse.json({ error: "Topic must be a non-empty string." }, { status: 400 });
  }
  if (!numQuestions || numQuestions < 1 || numQuestions > 50) {
    return NextResponse.json({ error: "numQuestions must be between 1 and 50." }, { status: 400 });
  }

  const prompt = `Generate a ${difficulty} difficulty quiz about "${topic.trim()}" with exactly ${numQuestions} multiple-choice questions.

Return ONLY valid JSON with no markdown, no preamble, no explanation. Use this exact shape:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": 0,
      "explanation": "1-2 sentence explanation of why the answer is correct."
    }
  ]
}

Rules:
- Each question must have exactly 4 options.
- correctIndex must be 0, 1, 2, or 3.
- Do not include any text outside the JSON object.`;

  try {
    const data = await askAIForJSON(prompt, Math.min(4000, 800 + numQuestions * 200));

    if (!Array.isArray(data.questions) || data.questions.length === 0) {
      throw new Error("Response missing questions array.");
    }

    for (const q of data.questions) {
      if (typeof q.question !== "string") throw new Error("Question must be a string.");
      if (!Array.isArray(q.options) || q.options.length !== 4) throw new Error("Each question must have exactly 4 options.");
      if (typeof q.correctIndex !== "number" || q.correctIndex < 0 || q.correctIndex > 3) throw new Error("correctIndex must be 0-3.");
      if (typeof q.explanation !== "string") throw new Error("Explanation must be a string.");
    }

    return NextResponse.json({ topic: topic.trim(), difficulty, questions: data.questions });
  } catch (err) {
    console.error("[generate-quiz]", err);
    return NextResponse.json({ error: "Failed to generate quiz. Please try again." }, { status: 500 });
  }
}
