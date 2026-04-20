"use client";

import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import profileData from "@/data/profile.json";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (v) => setScrolled(v > 60));
  }, [scrollY]);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-colors duration-300 ${
        scrolled ? "bg-[var(--background)]/90 border-b border-[var(--border)]" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <motion.a
          href="#about"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm font-medium tracking-widest uppercase text-[var(--foreground)] hover:opacity-60 transition-opacity cursor-pointer"
        >
          {profileData.name}
        </motion.a>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-6"
        >
          <nav className="hidden md:flex items-center gap-6 text-xs tracking-widest uppercase text-[var(--muted)]">
            {["about", "projects", "experience", "contact"].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className="hover:text-[var(--foreground)] transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
          <ThemeToggle />
        </motion.div>
      </div>
    </motion.nav>
  );
}
