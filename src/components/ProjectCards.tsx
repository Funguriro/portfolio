"use client";

import { motion } from "framer-motion";
import { ExternalLink, GitFork, ArrowUpRight } from "lucide-react";
import projectsData from "@/data/projects.json";
import { Project } from "@/types";

const projects = projectsData as Project[];

export default function ProjectCards({ inline = false }: { inline?: boolean }) {
  const displayed = inline ? projects.filter((p) => p.featured) : projects;

  return (
    <div id="projects" className={inline ? "" : "py-4"}>
      {!inline && (
        <p className="text-xs tracking-widest uppercase text-[var(--muted)] mb-4">Projects</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {displayed.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group relative p-5 border border-[var(--border)] bg-[var(--card)] hover:border-[var(--foreground)] transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <h3 className="text-sm font-medium text-[var(--foreground)] leading-tight">
                {project.title}
              </h3>
              <motion.div
                initial={{ opacity: 0, x: 5 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ArrowUpRight size={14} className="text-[var(--muted)]" />
              </motion.div>
            </div>

            <p className="text-xs text-[var(--muted)] leading-relaxed mb-4">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] tracking-wide px-2 py-0.5 border border-[var(--border)] text-[var(--muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  <GitFork size={12} />
                  Code
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  <ExternalLink size={12} />
                  Live
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
