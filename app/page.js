"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import TopicForm from "./components/TopicForm";
import QuizCard from "./components/QuizCard";
import ResultsScreen from "./components/ResultsScreen";

export default function Home() {
  const [stage, setStage] = useState("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [secondsPerQuestion, setSecondsPerQuestion] = useState(20);
  const [result, setResult] = useState(null);

  async function handleStart({ topic, difficulty, numQuestions, secondsPerQuestion: spq }) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, numQuestions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate quiz.");
      setQuiz(data);
      setSecondsPerQuestion(spq);
      setStage("quiz");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleFinish(userAnswers) {
    try {
      const res = await fetch("/api/grade-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions: quiz.questions,
          userAnswers,
          topic: quiz.topic,
          difficulty: quiz.difficulty,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to grade quiz.");
      setResult(data);
      setStage("results");
    } catch (err) {
      setError(err.message);
      setStage("form");
    }
  }

  function handleRestart() {
    setStage("form");
    setQuiz(null);
    setResult(null);
    setError(null);
  }

  return (
    <AnimatePresence mode="wait">
      {stage === "quiz" && quiz ? (
        <QuizCard key="quiz" quiz={quiz} secondsPerQuestion={secondsPerQuestion} onFinish={handleFinish} />
      ) : stage === "results" && result ? (
        <ResultsScreen key="results" result={result} saved={result.saved} onRestart={handleRestart} />
      ) : (
        <TopicForm key="form" onStart={handleStart} loading={loading} error={error} />
      )}
    </AnimatePresence>
  );
}
