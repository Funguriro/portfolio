"use client";

import { motion } from "framer-motion";
import { GitFork, Link, Mail } from "lucide-react";
import profileData from "@/data/profile.json";

export default function Footer() {
  return (
    <footer id="contact" className="py-16 border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-1">
              Let's build something
            </p>
            <h3 className="text-xl font-light text-[var(--foreground)]">{profileData.name}</h3>
            <a
              href={`mailto:${profileData.email}`}
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mt-1 block"
            >
              {profileData.email}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-4"
          >
            <a
              href={profileData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)] transition-all"
              aria-label="LinkedIn"
            >
              <Link size={15} />
            </a>
            <a
              href={`https://github.com/${profileData.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)] transition-all"
              aria-label="GitHub"
            >
              <GitFork size={15} />
            </a>
            <a
              href={`mailto:${profileData.email}`}
              className="w-9 h-9 border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)] transition-all"
              aria-label="Email"
            >
              <Mail size={15} />
            </a>
          </motion.div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} {profileData.name}. All rights reserved.
          </p>
          <p className="text-xs text-[var(--muted)]">
            Built with Next.js · OpenAI · Pinecone
          </p>
        </div>
      </div>
    </footer>
  );
}
