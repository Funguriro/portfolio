"use client";

import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import profileData from "@/data/profile.json";

const NAV_ITEMS = [
  { label: "About",      href: "/about" },
  { label: "Services",   href: "/services" },
  { label: "Projects",   href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Contact",    href: "/contact" },
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    return scrollY.on("change", (v) => setScrolled(v > 60));
  }, [scrollY]);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-colors duration-300 ${
        scrolled ? "bg-[var(--background)]/90 border-b border-[var(--border)]" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/"
            className="text-sm font-medium tracking-widest uppercase text-[var(--foreground)] hover:opacity-60 transition-opacity"
          >
            {profileData.name}
          </Link>
        </motion.div>

        {/* Nav links */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-6"
        >
          <nav className="hidden md:flex items-center gap-6 text-xs tracking-widest uppercase">
            {NAV_ITEMS.map(({ label, href }) => {
              const isActive =
                href === "/about" ? pathname === "/about" : false;
              return (
                <Link
                  key={label}
                  href={href}
                  className={`transition-colors ${
                    isActive
                      ? "text-[var(--foreground)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
        </motion.div>
      </div>
    </motion.header>
  );
}
