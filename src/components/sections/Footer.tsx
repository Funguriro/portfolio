"use client";

import { motion } from "framer-motion";
import { GitFork, Mail } from "lucide-react";
import NextLink from "next/link";
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
            <NextLink
              href="/"
              className="text-xl font-light text-[var(--foreground)] hover:opacity-60 transition-opacity mb-1 block"
            >
              {profileData.name}
            </NextLink>
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-1">
              Let's build something
            </p>
            <a
              href={`mailto:${profileData.contact.email}`}
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mt-1 block"
            >
              {profileData.contact.email}
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
              href={profileData.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)] transition-all"
              aria-label="LinkedIn"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a
              href={`https://github.com/${profileData.social.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)] transition-all"
              aria-label="GitHub"
            >
              <GitFork size={15} />
            </a>
            <a
              href={`mailto:${profileData.contact.email}`}
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
