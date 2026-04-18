"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import profileData from "@/data/profile.json";
import NeuralBackground from "./NeuralBackground";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], ["0%", "30%"]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section
      ref={ref}
      id="about"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <NeuralBackground />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-24 pb-16"
      >
        {/* Frosted glass card */}
        <div className="
          animate-rgb-card
          relative flex flex-col lg:flex-row items-center gap-16 lg:gap-24
          rounded-2xl p-8 lg:p-12
          bg-[var(--background)]/60 dark:bg-[var(--background)]/55
          backdrop-blur-xl
          border border-[var(--border)]/60
        ">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex-shrink-0 group"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-64 h-64 lg:w-80 lg:h-80 rounded-2xl overflow-hidden border border-[var(--border)] relative"
            >
              <Image
                src="/avatar.jpeg"
                alt={profileData.name}
                fill
                className="object-cover object-top"
                priority
              />
            </motion.div>
            {/* Decorative corners */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-[var(--foreground)] opacity-40" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-[var(--foreground)] opacity-40" />
          </motion.div>

          {/* Text content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-4"
            >
              {profileData.location}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl lg:text-7xl font-light leading-none tracking-tight text-[var(--foreground)] mb-4"
            >
              {profileData.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-xl lg:text-2xl text-[var(--muted)] font-light mb-6 tracking-wide"
            >
              {profileData.tagline}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="text-sm lg:text-base text-[var(--muted)] leading-relaxed max-w-lg"
            >
              {profileData.bio}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center gap-4 mt-8 justify-center lg:justify-start flex-wrap"
            >
              <a
                href="#chat"
                className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] text-sm tracking-widest uppercase hover:opacity-80 transition-opacity"
              >
                Ask me anything
              </a>
              <a
                href={profileData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="animate-rgb-border px-6 py-3 border-2 border-transparent text-[var(--foreground)] text-sm tracking-widest uppercase transition-colors"
              >
                LinkedIn
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--muted)]"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowDown size={16} />
        </motion.div>
        <span className="text-xs tracking-widest uppercase">Scroll</span>
      </motion.div>
    </section>
  );
}
