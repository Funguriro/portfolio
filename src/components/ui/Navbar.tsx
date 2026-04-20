"use client";

import { motion, useScroll, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import profileData from "@/data/profile.json";

const NAV_ITEMS = [
  { label: "About",      href: "/about"       },
  { label: "Services",   href: "/services"    },
  { label: "Projects",   href: "/projects"    },
  { label: "Experience", href: "/experience"  },
  { label: "Contact",    href: "/contact"     },
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    return scrollY.on("change", (v) => setScrolled(v > 60));
  }, [scrollY]);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-colors duration-300 ${
          scrolled || menuOpen
            ? "bg-[var(--background)]/95 border-b border-[var(--border)]"
            : "bg-transparent"
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

          {/* Right side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6 text-xs tracking-widest uppercase">
              {NAV_ITEMS.map(({ label, href }) => {
                const isActive = pathname === href;
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

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden flex items-center justify-center w-9 h-9 border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={menuOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0,   scale: 1   }}
                  exit={{    opacity: 0, rotate:  90,  scale: 0.7 }}
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

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer panel */}
            <motion.nav
              key="drawer"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed top-16 left-0 right-0 z-40 bg-[var(--background)] border-b border-[var(--border)] md:hidden"
            >
              <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
                {NAV_ITEMS.map(({ label, href }, i) => {
                  const isActive = pathname === href;
                  return (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                    >
                      <Link
                        href={href}
                        className={`flex items-center justify-between py-3.5 border-b border-[var(--border)] last:border-b-0 text-xs tracking-[0.25em] uppercase transition-colors ${
                          isActive
                            ? "text-[var(--foreground)]"
                            : "text-[var(--muted)] hover:text-[var(--foreground)]"
                        }`}
                      >
                        <span>{label}</span>
                        {isActive && (
                          <motion.span
                            layoutId="mobile-active"
                            className="w-1.5 h-1.5 rounded-full bg-[var(--foreground)]"
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Quick actions */}
                <div className="pt-4 pb-2 flex items-center gap-3">
                  <a
                    href="https://wa.me/12272492922"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-3 bg-[var(--foreground)] text-[var(--background)] text-[10px] tracking-widest uppercase"
                  >
                    WhatsApp
                  </a>
                  <a
                    href="mailto:hello@amonigel.com"
                    className="flex-1 text-center py-3 border border-[var(--border)] text-[var(--foreground)] text-[10px] tracking-widest uppercase hover:border-[var(--foreground)] transition-colors"
                  >
                    Email
                  </a>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
