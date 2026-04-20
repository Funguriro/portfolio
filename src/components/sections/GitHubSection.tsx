"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GitFork, Star, ExternalLink } from "lucide-react";

interface Repo {
  id: number;
  name: string;
  description: string;
  url: string;
  stars: number;
  language: string;
  updatedAt: string;
}

export default function GitHubSection() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then((data) => {
        setRepos(data.repos || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!loading && !repos.length) return null;

  return (
    <section className="py-24 border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-2">Open Source</p>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-light text-[var(--foreground)]">GitHub Activity</h2>
            <GitFork size={20} className="text-[var(--muted)]" />
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 border border-[var(--border)] bg-[var(--card)] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {repos.map((repo, i) => (
              <motion.a
                key={repo.id}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="group p-5 border border-[var(--border)] bg-[var(--card)] hover:border-[var(--foreground)] transition-all duration-300 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-[var(--foreground)] group-hover:underline underline-offset-2 leading-tight">
                    {repo.name}
                  </p>
                  <ExternalLink size={12} className="text-[var(--muted)] flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <p className="text-xs text-[var(--muted)] leading-relaxed flex-1 line-clamp-2">
                  {repo.description || "No description"}
                </p>

                <div className="flex items-center gap-3">
                  {repo.language && (
                    <span className="text-[10px] text-[var(--muted)] tracking-wide">{repo.language}</span>
                  )}
                  {repo.stars > 0 && (
                    <span className="flex items-center gap-1 text-[10px] text-[var(--muted)]">
                      <Star size={10} />
                      {repo.stars}
                    </span>
                  )}
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
