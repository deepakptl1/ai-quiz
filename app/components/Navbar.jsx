"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = () => setDropdownOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [dropdownOpen]);

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-1">
          <Link href="/" className="font-display text-xl font-semibold text-[var(--color-accent)] mr-4 hover:opacity-80 transition-opacity">
            QuizAI
          </Link>
          <NavLink href="/">New Quiz</NavLink>
          {session && <NavLink href="/profile">Profile</NavLink>}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <motion.button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
            whileTap={{ rotate: 180, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {mounted && (
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {session ? (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <motion.button
                onClick={() => setDropdownOpen((o) => !o)}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-[var(--color-bg)] transition-colors"
              >
                {session.user?.image ? (
                  <img src={session.user.image} alt="" className="w-7 h-7 rounded-full ring-2 ring-[var(--color-accent)]/30" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-xs font-bold text-[#12231C]">
                    {session.user?.name?.[0] ?? "U"}
                  </div>
                )}
                <span className="text-sm text-[var(--color-text)] hidden sm:block max-w-[100px] truncate">
                  {session.user?.name?.split(" ")[0]}
                </span>
                <motion.span
                  animate={{ rotate: dropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronIcon />
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-44 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl overflow-hidden"
                  >
                    <div className="px-4 py-2.5 border-b border-[var(--color-border)]">
                      <p className="text-xs text-[var(--color-muted)] truncate">{session.user?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
                    >
                      <span className="text-base">👤</span> Profile
                    </Link>
                    <button
                      onClick={() => { setDropdownOpen(false); signOut(); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#EB5757] hover:bg-[var(--color-bg)] transition-colors border-t border-[var(--color-border)]"
                    >
                      <span className="text-base">↩</span> Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              onClick={() => signIn("google")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="text-sm bg-[var(--color-accent)] text-[#12231C] font-semibold px-4 py-1.5 rounded-xl hover:opacity-90 transition-opacity"
            >
              Sign in
            </motion.button>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)] px-3 py-1.5 rounded-lg transition-all"
    >
      {children}
    </Link>
  );
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}
