"use client";

import { motion } from "framer-motion";

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center gap-3 px-4 py-3"
    >
      <div className="w-7 h-7 rounded-full bg-[var(--foreground)] flex items-center justify-center flex-shrink-0">
        <span className="text-[var(--background)] text-xs font-medium">N</span>
      </div>
      <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm bg-[var(--card)] border border-[var(--border)]">
        <div className="typing-dot w-1.5 h-1.5 rounded-full bg-[var(--muted)]" />
        <div className="typing-dot w-1.5 h-1.5 rounded-full bg-[var(--muted)]" />
        <div className="typing-dot w-1.5 h-1.5 rounded-full bg-[var(--muted)]" />
      </div>
    </motion.div>
  );
}
