"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import profileData from "@/data/profile.json";
import NeuralBackground from "@/components/background/NeuralBackground";

/* ── Typewriter ─────────────────────────────────────────────── */
const ROLES = [
  "AI Researcher",
  "Data Analyst",
  "Software Engineer",
  "Computer Vision Engineer",
];

function useTypewriter(words: string[]) {
  const [text, setText] = useState("");
  const [wi, setWi] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const word = words[wi % words.length];
    let t: ReturnType<typeof setTimeout>;

    if (!del && text === word) {
      t = setTimeout(() => setDel(true), 1800);
    } else if (del && text === "") {
      setDel(false);
      setWi(i => i + 1);
    } else {
      t = setTimeout(
        () => setText(del ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
        del ? 35 : 72
      );
    }
    return () => clearTimeout(t);
  }, [text, del, wi, words]);

  return text;
}

/* ── Tech chips ─────────────────────────────────────────────── */
const LEFT_CHIPS  = ["Python", "PyTorch", "OpenCV"];
const RIGHT_CHIPS = ["Next.js", "Pinecone", "SQL / NoSQL"];

/* ── Stats ──────────────────────────────────────────────────── */
const STATS = [
  { value: "AI",  label: "Research Focus" },
  { value: "50+", label: "Projects Built"  },
  { value: "8+",  label: "Years Coding"    },
];

/* ── Component ──────────────────────────────────────────────── */
export default function Hero() {
  const ref  = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const opacity   = useTransform(scrollY, [0, 420], [1, 0]);
  const yParallax = useTransform(scrollY, [0, 420], ["0%", "12%"]);
  const role = useTypewriter(ROLES);

  return (
    <section
      ref={ref}
      id="about"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      <NeuralBackground />

      <motion.div
        style={{ opacity, y: yParallax }}
        className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-28 pb-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 lg:gap-24 items-center">

          {/* ══ LEFT: Text ══════════════════════════════════════ */}
          <div className="max-w-xl">

            {/* Status line */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2.5 mb-10"
            >
              <motion.span
                className="block w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--muted)]">
                {profileData.location}&nbsp;&nbsp;·&nbsp;&nbsp;Available for collaboration
              </span>
            </motion.div>

            {/* Name */}
            <div className="mb-5">
              <motion.p
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl lg:text-6xl font-extralight leading-tight tracking-tight text-[var(--foreground)]"
              >
                Amos
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.17 }}
                className="text-5xl lg:text-6xl font-extralight leading-tight tracking-tight text-[var(--foreground)] opacity-20"
              >
                Nigel
              </motion.p>
            </div>

            {/* Typewriter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.5 }}
              className="flex items-center gap-2 mb-8 h-7"
            >
              <span className="font-mono text-xs text-green-400 select-none">$&gt;</span>
              <span className="font-mono text-sm text-[var(--foreground)]">{role}</span>
              <motion.span
                className="inline-block w-px h-[1.1em] bg-green-400 translate-y-px"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.65, repeat: Infinity }}
              />
            </motion.div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="text-sm text-[var(--muted)] leading-relaxed font-light mb-10"
            >
              {profileData.bio}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.8 }}
              className="flex items-center gap-4 flex-wrap mb-12"
            >
              <motion.a
                href="#chat"
                className="inline-flex items-center px-7 py-3 bg-[var(--foreground)] text-[var(--background)] text-xs tracking-widest uppercase"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Ask me anything
              </motion.a>
              <motion.a
                href={profileData.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex px-7 py-3 border border-[var(--border)] text-[var(--foreground)] text-xs tracking-widest uppercase hover:border-[var(--foreground)] transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                LinkedIn
              </motion.a>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.0 }}
              className="flex items-center gap-10 pt-8 border-t border-[var(--border)]"
            >
              {STATS.map(({ value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 1.05 + i * 0.08 }}
                >
                  <p className="text-2xl font-light text-[var(--foreground)] leading-none mb-1">{value}</p>
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--muted)]">{label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ══ RIGHT: Portrait + chips ═════════════════════════ */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative">

              {/* Portrait */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative w-80 h-[28rem] overflow-hidden scan-overlay"
              >
                {/* Corner accents */}
                <motion.div
                  className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[var(--foreground)] z-20"
                  animate={{ opacity: [0.35, 1, 0.35] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
                <motion.div
                  className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[var(--foreground)] z-20"
                  animate={{ opacity: [0.35, 1, 0.35] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1.25 }}
                />

                <Image
                  src="/avatar.jpeg"
                  alt={profileData.name}
                  fill
                  className="object-cover object-top"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[var(--background)] to-transparent z-10" />
              </motion.div>

              {/* ID strip beneath portrait */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.1 }}
                className="flex items-center justify-between px-3 py-2 border border-t-0 border-[var(--border)] bg-[var(--background)]/70 backdrop-blur-sm"
              >
                <span className="font-mono text-[9px] tracking-widest text-[var(--muted)] uppercase">ID_AMO_01</span>
                <motion.span
                  className="font-mono text-[9px] tracking-widest text-green-400 uppercase"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  ● ONLINE
                </motion.span>
              </motion.div>

              {/* LEFT chips */}
              {LEFT_CHIPS.map((label, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 + i * 0.12 }}
                  style={{
                    position: "absolute",
                    right: "calc(100% + 10px)",
                    top: `${18 + i * 28}%`,
                    transform: "translateY(-50%)",
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2.8 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                    className="font-mono text-[10px] tracking-widest px-3 py-1.5 border border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm text-[var(--muted)] uppercase whitespace-nowrap"
                  >
                    {label}
                  </motion.div>
                </motion.div>
              ))}

              {/* RIGHT chips */}
              {RIGHT_CHIPS.map((label, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1.0 + i * 0.12 }}
                  style={{
                    position: "absolute",
                    left: "calc(100% + 10px)",
                    top: `${18 + i * 28}%`,
                    transform: "translateY(-50%)",
                  }}
                >
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 3.0 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 }}
                    className="font-mono text-[10px] tracking-widest px-3 py-1.5 border border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm text-[var(--muted)] uppercase whitespace-nowrap"
                  >
                    {label}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator — animated vertical line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          className="w-px h-10 bg-[var(--border)] origin-top"
          animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[var(--muted)]">Scroll</span>
      </motion.div>
    </section>
  );
}
