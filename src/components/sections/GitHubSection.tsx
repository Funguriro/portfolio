"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GitFork, Star, ExternalLink, Code2 } from "lucide-react";

interface Repo {
  id: number;
  name: string;
  description: string;
  url: string;
  stars: number;
  language: string;
  updatedAt: string;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript:  "#3178c6",
  JavaScript:  "#f1e05a",
  Python:      "#3572A5",
  Rust:        "#dea584",
  Go:          "#00ADD8",
  CSS:         "#563d7c",
  HTML:        "#e34c26",
  Java:        "#b07219",
  "C++":       "#f34b7d",
  C:           "#555555",
  Shell:       "#89e051",
  Jupyter:     "#DA5B0B",
  Dockerfile:  "#384d54",
};

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1)   return "today";
  if (days < 7)   return `${days}d ago`;
  if (days < 30)  return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.5 } },
};

function RepoCard({ repo }: { repo: Repo }) {
  const langColor = LANG_COLORS[repo.language] ?? "#666";

  return (
    <motion.a
      variants={item}
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -4, transition: { type: "spring", stiffness: 280, damping: 22 } }}
      className="group p-6 border border-[var(--border)] bg-[var(--background)] flex flex-col gap-4 relative overflow-hidden transition-colors duration-300 hover:border-[var(--foreground)]/30"
    >
      {/* Top accent line */}
      <motion.div
        className="absolute inset-x-0 top-0 h-px bg-[var(--foreground)] origin-left"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* HUD corners */}
      <span className="absolute top-3 left-3 w-3 h-3 border-t border-l border-transparent group-hover:border-[var(--foreground)]/25 transition-all duration-300" />
      <span className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-transparent group-hover:border-[var(--foreground)]/25 transition-all duration-300" />

      {/* Repo name + external icon */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-light text-[var(--foreground)] leading-snug group-hover:opacity-100 opacity-80 transition-opacity">
          {repo.name}
        </p>
        <ExternalLink
          size={11}
          className="text-[var(--muted)] flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-60 transition-opacity"
        />
      </div>

      {/* Description */}
      <p className="text-xs text-[var(--muted)] leading-relaxed flex-1 line-clamp-2 font-light">
        {repo.description || "No description"}
      </p>

      {/* Footer meta */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-3">
          {repo.language && (
            <span className="flex items-center gap-1.5 text-[10px] text-[var(--muted)] tracking-wide">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: langColor }}
              />
              {repo.language}
            </span>
          )}
          {repo.stars > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-[var(--muted)]">
              <Star size={9} />
              {repo.stars}
            </span>
          )}
        </div>
        {repo.updatedAt && (
          <span className="text-[9px] tracking-widest uppercase text-[var(--muted)] opacity-60">
            {relativeTime(repo.updatedAt)}
          </span>
        )}
      </div>
    </motion.a>
  );
}

function SkeletonCard() {
  return (
    <div className="p-6 border border-[var(--border)] bg-[var(--background)] flex flex-col gap-4">
      <div className="h-3 w-2/3 bg-[var(--border)] animate-pulse" />
      <div className="space-y-1.5">
        <div className="h-2 w-full bg-[var(--border)] animate-pulse opacity-60" />
        <div className="h-2 w-4/5 bg-[var(--border)] animate-pulse opacity-40" />
      </div>
      <div className="h-px bg-[var(--border)]" />
      <div className="h-2 w-1/3 bg-[var(--border)] animate-pulse opacity-50" />
    </div>
  );
}

export default function GitHubSection() {
  const [repos, setRepos]       = useState<Repo[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch("/api/github")
      .then(r => r.json())
      .then(data => { setRepos(data.repos || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (!loading && !repos.length) return null;

  return (
    <section className="py-24 border-b border-[var(--border)] relative overflow-hidden">

      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.03),transparent_70%)]" />

      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14"
        >
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-3 flex items-center gap-2">
              <motion.span
                className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"
                animate={{ opacity: [1, 0.2, 1], scale: [1, 1.5, 1] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              />
              Open Source
            </p>
            <h2 className="text-3xl lg:text-4xl font-light text-[var(--foreground)] leading-tight">
              GitHub Activity<br />
              <span className="opacity-30">Recent repositories</span>
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 text-[var(--muted)]"
          >
            <Code2 size={14} className="opacity-40" />
            <span className="text-[10px] tracking-[0.25em] uppercase opacity-40">
              github.com/amonigel
            </span>
          </motion.div>
        </motion.div>

        {/* Animated divider */}
        <motion.div
          className="h-px bg-[var(--border)] origin-left mb-10"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            {repos.map(repo => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </motion.div>
        )}

      </div>
    </section>
  );
}
