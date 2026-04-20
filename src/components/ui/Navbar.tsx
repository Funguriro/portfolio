"use client";

import { motion, useScroll, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import profileData from "@/data/profile.json";

const NAV_ITEMS = [
  { label: "About",      href: "/about",      num: "01" },
  { label: "Services",   href: "/services",   num: "02" },
  { label: "Projects",   href: "/projects",   num: "03" },
  { label: "Experience", href: "/experience", num: "04" },
  { label: "Contact",    href: "/contact",    num: "05" },
];

const SOCIALS = [
  { label: "LinkedIn",  href: profileData.social.linkedin },
  { label: "GitHub",    href: `https://github.com/${profileData.social.github}` },
  { label: "Instagram", href: "https://www.instagram.com/nigel_amo" },
  { label: "WhatsApp",  href: `https://wa.me/${profileData.contact.whatsapp}` },
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => scrollY.on("change", (v) => setScrolled(v > 60)), [scrollY]);
  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-colors duration-300 ${
          scrolled && !menuOpen
            ? "bg-[var(--background)]/90 border-b border-[var(--border)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/" className="text-sm font-medium tracking-widest uppercase text-[var(--foreground)] hover:opacity-60 transition-opacity">
              {profileData.name}
            </Link>
          </motion.div>

          {/* Right */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-4">

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6 text-xs tracking-widest uppercase">
              {NAV_ITEMS.map(({ label, href }) => (
                <Link key={label} href={href}
                  className={`transition-colors ${pathname === href ? "text-[var(--foreground)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}>
                  {label}
                </Link>
              ))}
            </nav>

            <ThemeToggle />

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden relative flex items-center justify-center w-9 h-9 border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors z-[60]"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={menuOpen ? "x" : "menu"}
                  initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: 0,   scale: 1   }}
                  exit={{    opacity: 0, rotate:  90,  scale: 0.6 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center justify-center"
                >
                  {menuOpen ? <X size={16} /> : <Menu size={16} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </motion.div>
        </div>
      </motion.header>

      {/* ── Full-screen mobile overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="fullscreen-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 md:hidden bg-[var(--background)] flex flex-col overflow-hidden"
          >
            {/* Ambient glows */}
            <div className="pointer-events-none absolute top-0 right-0 w-72 h-72 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.06),transparent_70%)]" />
            <div className="pointer-events-none absolute bottom-0 left-0 w-72 h-72 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.06),transparent_70%)]" />

            {/* Animated grid lines */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: "linear-gradient(var(--foreground) 1px,transparent 1px),linear-gradient(90deg,var(--foreground) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

            {/* Header row */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-[var(--border)] flex-shrink-0">
              <motion.p
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]"
              >
                Navigation
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="flex items-center gap-1.5"
              >
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
                <span className="font-mono text-[9px] tracking-widest uppercase text-[var(--muted)]">Online</span>
              </motion.div>
            </div>

            {/* Nav links — main content */}
            <nav className="flex-1 flex flex-col justify-center px-8 gap-0">
              {NAV_ITEMS.map(({ label, href, num }, i) => {
                const isActive = pathname === href;
                return (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
                    animate={{ opacity: 1, x: 0,   filter: "blur(0px)" }}
                    exit={{    opacity: 0, x: -24,  filter: "blur(4px)" }}
                    transition={{ duration: 0.35, delay: 0.1 + i * 0.07 }}
                    className="border-b border-[var(--border)] last:border-b-0"
                  >
                    <Link
                      href={href}
                      className={`group flex items-center justify-between py-5 transition-colors duration-200 ${
                        isActive ? "text-[var(--foreground)]" : "text-[var(--muted)]"
                      }`}
                    >
                      <div className="flex items-center gap-5">
                        <span className="font-mono text-[10px] tracking-widest text-[var(--muted)] opacity-40 w-6">{num}</span>
                        <motion.span
                          className={`text-3xl font-light tracking-tight leading-none transition-colors duration-200 ${
                            isActive ? "text-[var(--foreground)]" : "text-[var(--foreground)] opacity-60 group-hover:opacity-100"
                          }`}
                          whileHover={{ x: 6 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {label}
                        </motion.span>
                      </div>
                      <div className="flex items-center gap-3">
                        {isActive && (
                          <motion.span
                            layoutId="mobile-dot"
                            className="w-1.5 h-1.5 rounded-full bg-[var(--foreground)]"
                          />
                        )}
                        <motion.span
                          className="opacity-0 group-hover:opacity-40 transition-opacity"
                          whileHover={{ rotate: 45 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowUpRight size={18} />
                        </motion.span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
              className="px-8 pb-8 pt-6 border-t border-[var(--border)] flex-shrink-0"
            >
              {/* Social links */}
              <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-[var(--muted)] mb-4">Find me on</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {SOCIALS.map(({ label, href }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="px-4 py-2 border border-[var(--border)] text-[10px] tracking-widest uppercase text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)] transition-all"
                  >
                    {label}
                  </motion.a>
                ))}
              </div>

              {/* CTA row */}
              <div className="flex items-center gap-3">
                <a
                  href={`https://wa.me/${profileData.contact.whatsapp}?text=Hi%20Nigel%2C%20I%20found%20you%20on%20your%20portfolio!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-3 bg-[var(--foreground)] text-[var(--background)] text-[10px] tracking-widest uppercase"
                >
                  Get a quote
                </a>
                <a
                  href={`mailto:${profileData.contact.email}`}
                  className="flex-1 text-center py-3 border border-[var(--border)] text-[var(--foreground)] text-[10px] tracking-widest uppercase hover:border-[var(--foreground)] transition-colors"
                >
                  Email me
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
