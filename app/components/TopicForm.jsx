"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

const DIFFICULTIES = ["easy", "medium", "hard"];

export default function TopicForm({ onStart, loading, error }) {
  const { data: session, status } = useSession();
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(10);
  const [seconds, setSeconds] = useState(20);
  const [topic, setTopic] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!session) { signIn("google"); return; }
    onStart({ topic: topic.trim(), difficulty, numQuestions, secondsPerQuestion: seconds });
  }

  const difficultyColor = { easy: "#6FCF97", medium: "#E8B04B", hard: "#EB5757" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4"
    >
      <div className="w-full max-w-lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 mb-4">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="font-display text-4xl font-semibold text-[var(--color-text)] mb-2">
            Test Your <span className="text-[var(--color-accent)]">Knowledge</span>
          </h1>
          <p className="text-[var(--color-muted)] text-sm">
            Pick a topic, set your challenge, and beat the clock.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-7 shadow-xl shadow-black/20"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Topic input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)] mb-2">
                Topic
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. The Roman Empire, Quantum Physics…"
                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] placeholder-[var(--color-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]/30 transition-all text-sm"
              />
            </div>

            {/* Difficulty pills */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)] mb-2">
                Difficulty
              </label>
              <div className="grid grid-cols-3 gap-2">
                {DIFFICULTIES.map((d) => (
                  <motion.button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    whileTap={{ scale: 0.96 }}
                    className="relative py-2.5 rounded-xl border text-sm font-medium capitalize transition-all"
                    style={{
                      borderColor: difficulty === d ? difficultyColor[d] : "var(--color-border)",
                      backgroundColor: difficulty === d ? `${difficultyColor[d]}18` : "var(--color-bg)",
                      color: difficulty === d ? difficultyColor[d] : "var(--color-muted)",
                    }}
                  >
                    {difficulty === d && (
                      <motion.div
                        layoutId="diff-indicator"
                        className="absolute inset-0 rounded-xl"
                        style={{ backgroundColor: `${difficultyColor[d]}10` }}
                      />
                    )}
                    <span className="relative">{d}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Question count input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
                  Number of Questions
                </label>
                <span className="font-mono text-sm font-semibold text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2 py-0.5 rounded-lg">
                  {numQuestions}Q
                </span>
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setNumQuestions((n) => Math.max(1, n - 1))}
                  className="w-10 h-10 shrink-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-lg font-bold hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors flex items-center justify-center"
                >
                  −
                </motion.button>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={numQuestions}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v) && v >= 1) setNumQuestions(Math.min(50, v));
                  }}
                  className="flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-center text-[var(--color-text)] font-mono font-semibold text-lg focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]/30 transition-all"
                />
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setNumQuestions((n) => Math.min(50, n + 1))}
                  className="w-10 h-10 shrink-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-lg font-bold hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors flex items-center justify-center"
                >
                  +
                </motion.button>
              </div>
              <p className="text-xs text-[var(--color-muted)]/60 mt-1.5 text-center">1 – 50 questions</p>
            </div>

            {/* Seconds slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
                  Time per Question
                </label>
                <span className="font-mono text-sm font-semibold text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2 py-0.5 rounded-lg">
                  {seconds}s
                </span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={seconds}
                  onChange={(e) => setSeconds(Number(e.target.value))}
                  className="w-full accent-[var(--color-accent)] h-1.5 rounded-full cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-xs text-[var(--color-muted)]/60 mt-1.5">
                <span>10s — Fast</span>
                <span>60s — Relaxed</span>
              </div>
            </div>

            {/* Sign-in notice */}
            <AnimatePresence>
              {!session && status !== "loading" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-xs text-[var(--color-muted)] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-3 py-2.5"
                >
                  <span>🔒</span>
                  <span>Sign in with Google to save your results to your profile.</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[var(--color-incorrect)] text-sm flex items-center gap-2"
                >
                  <span>⚠</span> {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading || !topic.trim()}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full relative overflow-hidden bg-[var(--color-accent)] text-[#12231C] font-semibold rounded-xl py-3.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner /> Generating quiz…
                </span>
              ) : session ? (
                "Start Quiz →"
              ) : (
                "Sign in & Start →"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}

function LoadingSpinner() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      className="inline-block w-4 h-4 border-2 border-[#12231C]/30 border-t-[#12231C] rounded-full"
    />
  );
}
