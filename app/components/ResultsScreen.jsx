"use client";

import { motion } from "framer-motion";

export default function ResultsScreen({ result, onRestart, saved }) {
  const { score, total, percentage, results } = result;

  const grade =
    percentage >= 80 ? { label: "Excellent!", emoji: "🏆", color: "#6FCF97" }
    : percentage >= 60 ? { label: "Good job!", emoji: "🎯", color: "#E8B04B" }
    : percentage >= 40 ? { label: "Keep going!", emoji: "💪", color: "#E8B04B" }
    : { label: "Keep studying!", emoji: "📚", color: "#EB5757" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4"
    >
      <div className="w-full max-w-2xl py-8">

        {/* Score hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05, duration: 0.3 }}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 mb-5 text-center relative overflow-hidden"
        >
          {/* Decorative ring */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${grade.color}, transparent 70%)`,
            }}
          />
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
            className="text-5xl mb-3"
          >
            {grade.emoji}
          </motion.div>
          <p className="text-[var(--color-muted)] text-xs font-semibold uppercase tracking-widest mb-1">
            Final Score
          </p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-7xl font-semibold mb-1"
            style={{ color: grade.color }}
          >
            {score}<span className="text-3xl text-[var(--color-muted)]">/{total}</span>
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-display text-2xl text-[var(--color-text)] mb-2"
          >
            {percentage}%
          </motion.p>
          <p className="text-[var(--color-muted)] text-sm" style={{ color: grade.color }}>
            {grade.label}
          </p>

          {/* Score bar */}
          <div className="mt-5 w-full h-2 bg-[var(--color-bg)] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: grade.color }}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            />
          </div>

          {saved === false && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-xs text-[var(--color-muted)] border border-[var(--color-border)] rounded-xl px-3 py-2 inline-flex items-center gap-1.5"
            >
              <span>🔒</span> Sign in to save this result to your profile.
            </motion.p>
          )}
        </motion.div>

        {/* Results breakdown */}
        <div className="space-y-3 mb-5">
          {results.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.25 }}
              className="bg-[var(--color-surface)] border rounded-2xl overflow-hidden"
              style={{ borderColor: r.isCorrect ? "#6FCF97" + "60" : "#EB5757" + "60" }}
            >
              {/* Question header */}
              <div
                className="flex items-start gap-3 px-5 py-4"
                style={{ backgroundColor: r.isCorrect ? "#6FCF9710" : "#EB575710" }}
              >
                <span
                  className="mt-0.5 w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    backgroundColor: r.isCorrect ? "#6FCF97" : "#EB5757",
                    color: "#12231C",
                  }}
                >
                  {r.isCorrect ? "✓" : "✗"}
                </span>
                <p className="font-display text-[var(--color-text)] font-medium text-sm leading-relaxed">
                  {r.question}
                </p>
              </div>

              {/* Answer details */}
              <div className="px-5 py-4 space-y-2 text-sm border-t border-[var(--color-border)]">
                <div className="flex items-start gap-2">
                  <span className="text-[var(--color-muted)] shrink-0 w-24 text-xs pt-0.5">Your answer</span>
                  <span
                    className="font-medium"
                    style={{ color: r.isCorrect ? "#6FCF97" : "#EB5757" }}
                  >
                    {r.userAnswer === null ? "⏱ No answer (timed out)" : r.options[r.userAnswer]}
                  </span>
                </div>
                {!r.isCorrect && (
                  <div className="flex items-start gap-2">
                    <span className="text-[var(--color-muted)] shrink-0 w-24 text-xs pt-0.5">Correct</span>
                    <span className="font-medium" style={{ color: "#6FCF97" }}>
                      {r.options[r.correctIndex]}
                    </span>
                  </div>
                )}
                <div className="flex items-start gap-2 pt-1">
                  <span className="text-[var(--color-muted)] shrink-0 w-24 text-xs pt-0.5">Why</span>
                  <span className="text-[var(--color-muted)] italic text-xs leading-relaxed">
                    {r.explanation}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {onRestart && (
          <motion.button
            onClick={onRestart}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + results.length * 0.06 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[var(--color-accent)] text-[#12231C] font-semibold rounded-xl py-3.5 text-sm hover:opacity-90 transition-opacity"
          >
            Try another topic →
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
