"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import ResultsScreen from "../components/ResultsScreen";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/attempts")
      .then((r) => r.json())
      .then((d) => { setAttempts(d.attempts || []); setLoading(false); });
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 border-2 border-[var(--color-border)] border-t-[var(--color-accent)] rounded-full"
        />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center gap-5 p-4"
      >
        <div className="text-5xl">🔒</div>
        <p className="font-display text-2xl text-[var(--color-text)]">Sign in to view your profile</p>
        <p className="text-[var(--color-muted)] text-sm">Your quiz history and stats live here.</p>
        <motion.button
          onClick={() => signIn("google")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="bg-[var(--color-accent)] text-[#12231C] font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
        >
          Sign in with Google
        </motion.button>
      </motion.div>
    );
  }

  const totalQuizzes = attempts.length;
  const avgScore = totalQuizzes
    ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / totalQuizzes)
    : 0;
  const bestScore = totalQuizzes ? Math.max(...attempts.map((a) => a.percentage)) : 0;

  const expandedAttempt = attempts.find((a) => a._id === expanded);

  if (expandedAttempt) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-2xl mx-auto px-4"
      >
        <button
          onClick={() => setExpanded(null)}
          className="mt-6 mb-4 flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          ← Back to profile
        </button>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-display font-medium text-[var(--color-text)]">{expandedAttempt.topic}</span>
          <span className="text-[var(--color-border)]">·</span>
          <span className="text-xs capitalize text-[var(--color-muted)]">{expandedAttempt.difficulty}</span>
          <span className="text-[var(--color-border)]">·</span>
          <span className="text-xs text-[var(--color-muted)]">{new Date(expandedAttempt.createdAt).toLocaleDateString()}</span>
        </div>
        <ResultsScreen
          result={{ score: expandedAttempt.score, total: expandedAttempt.total, percentage: expandedAttempt.percentage, results: expandedAttempt.questions }}
          saved={true}
        />
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        {session.user?.image ? (
          <img src={session.user.image} alt="" className="w-14 h-14 rounded-2xl ring-2 ring-[var(--color-accent)]/30" />
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent)]/20 flex items-center justify-center font-display text-2xl text-[var(--color-accent)]">
            {session.user?.name?.[0]}
          </div>
        )}
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--color-text)]">
            {session.user?.name}
          </h1>
          <p className="text-[var(--color-muted)] text-sm">{session.user?.email}</p>
        </div>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-3 gap-3 mb-8"
      >
        {[
          { label: "Quizzes", value: totalQuizzes, suffix: "" },
          { label: "Avg Score", value: avgScore, suffix: "%" },
          { label: "Best Score", value: bestScore, suffix: "%" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.05 }}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 text-center"
          >
            <p className="font-display text-3xl font-semibold text-[var(--color-accent)]">
              {stat.value}{stat.suffix}
            </p>
            <p className="text-[var(--color-muted)] text-xs mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Attempts */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
          Quiz History
        </h2>
        {totalQuizzes > 0 && (
          <span className="text-xs text-[var(--color-muted)]">{totalQuizzes} total</span>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-6 h-6 border-2 border-[var(--color-border)] border-t-[var(--color-accent)] rounded-full"
          />
        </div>
      ) : attempts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 border border-dashed border-[var(--color-border)] rounded-2xl"
        >
          <p className="text-4xl mb-3">🎯</p>
          <p className="text-[var(--color-text)] font-medium mb-1">No quizzes yet</p>
          <p className="text-[var(--color-muted)] text-sm">Take your first quiz to see results here.</p>
        </motion.div>
      ) : (
        <div className="space-y-2.5">
          {attempts.map((a, i) => {
            const pctColor = a.percentage >= 80 ? "#6FCF97" : a.percentage >= 50 ? "#E8B04B" : "#EB5757";
            return (
              <motion.button
                key={a._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.2 }}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setExpanded(a._id)}
                className="w-full text-left bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 hover:border-[var(--color-accent)]/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors truncate">
                      {a.topic}
                    </p>
                    <p className="text-[var(--color-muted)] text-xs mt-0.5 capitalize">
                      {a.difficulty} · {a.total} questions · {new Date(a.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    <div className="text-right">
                      <p className="font-display text-base font-semibold" style={{ color: pctColor }}>
                        {a.score}/{a.total}
                      </p>
                      <p className="text-xs" style={{ color: pctColor }}>{a.percentage}%</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition-colors">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </div>
                {/* Mini score bar */}
                <div className="mt-3 h-1 bg-[var(--color-bg)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${a.percentage}%`, backgroundColor: pctColor }} />
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
