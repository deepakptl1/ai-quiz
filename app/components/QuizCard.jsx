"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizCard({ quiz, secondsPerQuestion, onFinish }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(secondsPerQuestion);
  const [locked, setLocked] = useState(false);

  const questions = quiz.questions;
  const total = questions.length;

  const advance = useCallback(
    (answer) => {
      const next = [...answers, answer];
      if (index + 1 >= total) {
        onFinish(next);
      } else {
        setAnswers(next);
        setIndex((i) => i + 1);
        setSelected(null);
        setLocked(false);
      }
    },
    [answers, index, total, onFinish]
  );

  useEffect(() => { setTimeLeft(secondsPerQuestion); }, [index, secondsPerQuestion]);

  useEffect(() => {
    if (locked) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [index, locked]);

  useEffect(() => {
    if (timeLeft <= 0 && !locked) {
      setLocked(true);
      advance(null);
    }
  }, [timeLeft, locked, advance]);

  function handleSelect(i) {
    if (locked) return;
    setLocked(true);
    setSelected(i);
    setTimeout(() => advance(i), 450);
  }

  const pct = Math.max(0, (timeLeft / secondsPerQuestion) * 100);
  const isUrgent = timeLeft <= 5;
  const q = questions[index];
  const progressPct = ((index) / total) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4"
    >
      <div className="w-full max-w-xl">
        {/* Top meta row */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
              {quiz.topic}
            </span>
            <span className="text-[var(--color-border)]">·</span>
            <span className="text-xs capitalize text-[var(--color-muted)]">{quiz.difficulty}</span>
          </div>
          <span className="text-xs text-[var(--color-muted)]">
            {index + 1} / {total}
          </span>
        </div>

        {/* Quiz progress — dots for ≤15, bar for more */}
        {total <= 15 ? (
          <div className="flex gap-1.5 mb-3">
            {questions.map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full transition-all duration-300"
                style={{
                  backgroundColor:
                    i < index
                      ? "var(--color-correct)"
                      : i === index
                      ? "var(--color-accent)"
                      : "var(--color-border)",
                }}
              />
            ))}
          </div>
        ) : (
          <div className="mb-3">
            <div className="w-full h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${(index / total) * 100}%`, backgroundColor: "var(--color-correct)" }}
              />
            </div>
          </div>
        )}

        {/* Countdown fuse bar */}
        <div className="w-full h-1 bg-[var(--color-border)] rounded-full mb-5 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: isUrgent ? "var(--color-incorrect)" : "var(--color-accent)" }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </div>

        {/* Card */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-xl shadow-black/20">
          {/* Timer header */}
          <div className="flex items-center justify-between px-7 pt-6 pb-0">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
              Question {index + 1}
            </span>
            <motion.span
              key={timeLeft}
              initial={{ scale: 1.2, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-mono text-base font-semibold tabular-nums px-2.5 py-0.5 rounded-lg"
              style={{
                color: isUrgent ? "var(--color-incorrect)" : "var(--color-accent)",
                backgroundColor: isUrgent ? "var(--color-incorrect)" + "18" : "var(--color-accent)" + "18",
              }}
            >
              {timeLeft}s
            </motion.span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="px-7 pt-5 pb-7"
            >
              <p className="font-display text-xl font-medium text-[var(--color-text)] mb-7 leading-relaxed">
                {q.question}
              </p>

              <div className="space-y-2.5">
                {q.options.map((opt, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleSelect(i)}
                    disabled={locked}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.2 }}
                    whileHover={!locked ? { x: 3 } : {}}
                    whileTap={!locked ? { scale: 0.98 } : {}}
                    className="w-full text-left px-5 py-3.5 rounded-xl border text-sm transition-all flex items-center gap-3 group"
                    style={{
                      borderColor: selected === i ? "var(--color-accent)" : "var(--color-border)",
                      backgroundColor:
                        selected === i
                          ? "var(--color-accent)" + "15"
                          : "var(--color-bg)",
                      color: "var(--color-text)",
                    }}
                  >
                    <span
                      className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center font-mono text-xs font-semibold transition-all"
                      style={{
                        backgroundColor:
                          selected === i ? "var(--color-accent)" : "var(--color-border)" + "80",
                        color: selected === i ? "#12231C" : "var(--color-muted)",
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1">{opt}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
