import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongoose";
import QuizAttempt from "@/lib/models/QuizAttempt";

// NOTE: correctIndex is exposed to the client in this MVP because there is no
// server-side quiz storage. This is a known trade-off for a portfolio project.
// In production, store questions server-side keyed by quizId and look up
// correctIndex there — never send it to the client.

export async function POST(request) {
  const body = await request.json();
  const { questions, userAnswers, topic, difficulty } = body;

  if (!Array.isArray(questions) || !Array.isArray(userAnswers)) {
    return NextResponse.json({ error: "questions and userAnswers must be arrays." }, { status: 400 });
  }
  if (questions.length !== userAnswers.length) {
    return NextResponse.json({ error: "questions and userAnswers must have the same length." }, { status: 400 });
  }

  let score = 0;
  const results = questions.map((q, i) => {
    const isCorrect = userAnswers[i] !== null && userAnswers[i] === q.correctIndex;
    if (isCorrect) score++;
    return {
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      userAnswer: userAnswers[i],
      isCorrect,
      explanation: q.explanation,
    };
  });

  const total = questions.length;
  const percentage = Math.round((score / total) * 100);

  // Auto-save if logged in
  const session = await auth();
  let saved = false;
  if (session?.user?.id && topic && difficulty) {
    try {
      await connectDB();
      await QuizAttempt.create({
        userId: session.user.id,
        topic,
        difficulty,
        score,
        total,
        percentage,
        questions: results,
      });
      saved = true;
    } catch (err) {
      console.error("[grade-quiz] save attempt failed:", err);
    }
  }

  return NextResponse.json({ score, total, percentage, results, saved });
}
