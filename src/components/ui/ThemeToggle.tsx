"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored === "dark" || (!stored && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  if (!mounted) return null;

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.9 }}
      className="relative w-12 h-6 rounded-full border border-[var(--border)] bg-[var(--card)] flex items-center px-1 transition-colors"
      aria-label="Toggle theme"
    >
      <motion.div
        animate={{ x: dark ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="w-4 h-4 rounded-full bg-[var(--foreground)] flex items-center justify-center"
      >
        {dark ? (
          <Moon size={8} className="text-[var(--background)]" />
        ) : (
          <Sun size={8} className="text-[var(--background)]" />
        )}
      </motion.div>
    </motion.button>
  );
}
