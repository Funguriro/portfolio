"use client";

import { motion, useScroll, useTransform, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";
import { ArrowLeft, GraduationCap, Heart, Compass } from "lucide-react";

/* ─── Reusable helpers ─────────────────────────────────────────── */

/** Blurry-word stagger reveal for headings */
function SplitWords({
  text,
  className,
  delay = 0,
  useInView = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  useInView?: boolean;
}) {
  const words = text.split(" ");
  const anim = useInView
    ? { initial: { opacity: 0, y: 28, filter: "blur(10px)" }, whileInView: { opacity: 1, y: 0, filter: "blur(0px)" }, viewport: { once: true } }
    : { initial: { opacity: 0, y: 28, filter: "blur(10px)" }, animate: { opacity: 1, y: 0, filter: "blur(0px)" } };

  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          {...anim}
          transition={{ duration: 0.55, delay: delay + i * 0.09 }}
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </span>
  );
}

/** Animated line that draws across (scaleX 0→1) */
function DrawLine({ delay = 0, className = "" }: { delay?: number; className?: string }) {
  return (
    <motion.div
      className={`h-px bg-[var(--border)] origin-left ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay }}
    />
  );
}

/** Pulsing corner accent bracket */
function CornerAccent({ position = "tr" }: { position?: "tl" | "tr" | "bl" | "br" }) {
  const pos: Record<string, string> = {
    tl: "top-0 left-0 border-t-2 border-l-2",
    tr: "top-0 right-0 border-t-2 border-r-2",
    bl: "bottom-0 left-0 border-b-2 border-l-2",
    br: "bottom-0 right-0 border-b-2 border-r-2",
  };
  return (
    <motion.div
      className={`absolute w-5 h-5 border-[var(--foreground)] ${pos[position]}`}
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/** Waveform bars for Spotify section */
function Waveform() {
  const bars = [0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.8, 0.4, 0.65, 0.9, 0.55, 0.75];
  return (
    <div className="flex items-end gap-0.5 h-8">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          className="w-1 bg-[var(--muted)] rounded-full origin-bottom"
          animate={{ scaleY: [height * 0.4, height, height * 0.5, height * 0.8, height * 0.3, height] }}
          transition={{
            duration: 1.6 + i * 0.07,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.08,
          }}
          style={{ height: "100%" }}
        />
      ))}
    </div>
  );
}

/* ─── Variants ─────────────────────────────────────────────────── */

const cardContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.55 } },
};

/* ─── Data ─────────────────────────────────────────────────────── */

const details = [
  {
    icon: GraduationCap,
    label: "Education",
    content:
      "Graduate student in Data Analytics at The Catholic University of America. My academic focus sits at the intersection of artificial intelligence, computer vision, and real-time machine learning — building intelligent systems that enable machines to perceive and act on complex visual information.",
  },
  {
    icon: Heart,
    label: "Personal",
    content:
      "I am a proud father of one beautiful daughter, married to one beautiful wife. Family is the foundation of everything I do. I aspire to be the best dad ever and to fully enjoy the life that God has given me.",
  },
  {
    icon: Compass,
    label: "Hobbies & Aspirations",
    content:
      "Travelling, sightseeing, and photography fuel my creativity. I enjoy gospel and uplifting music — especially while coding. I occasionally hit the gym to stay sharp. Beyond the screen, I build digital systems that solve real-world problems and aspire to lead at the frontier of AI.",
  },
];

/* ─── Page ─────────────────────────────────────────────────────── */

export default function AboutPage() {
  const portraitRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: portraitRef, offset: ["start end", "end start"] });
  const portraitY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[var(--background)]">

        {/* ── Page header ── */}
        <section className="pt-32 pb-16 border-b border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-6">

            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-10"
              >
                <motion.span whileHover={{ x: -3 }} transition={{ type: "spring", stiffness: 400 }}>
                  <ArrowLeft size={12} />
                </motion.span>
                Back
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-3 flex items-center gap-3"
            >
              <motion.span
                className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--muted)]"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
              About me
            </motion.p>

            <h1 className="text-4xl lg:text-6xl font-light text-[var(--foreground)] leading-none tracking-tight">
              <SplitWords text="The person" delay={0.12} />
              <br />
              <span className="opacity-30">
                <SplitWords text="behind the work" delay={0.34} />
              </span>
            </h1>

            <DrawLine delay={0.7} className="mt-12" />
          </div>
        </section>

        {/* ── Portrait + bio ── */}
        <section className="py-20 border-b border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Portrait with parallax + scan line */}
            <motion.div
              ref={portraitRef}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative"
            >
              {/* Offset background block */}
              <motion.div
                className="absolute -top-4 -left-4 w-full h-full border border-[var(--border)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 1, delay: 0.6 }}
              />

              {/* Portrait with scan line + parallax */}
              <div className="relative w-full aspect-[3/4] overflow-hidden scan-overlay">
                <motion.div className="absolute inset-0" style={{ y: portraitY }}>
                  <Image
                    src="/avatar1.jpeg"
                    alt="Nigel"
                    fill
                    className="object-cover object-top scale-110"
                    priority
                  />
                </motion.div>
                {/* Bottom fade */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--background)] to-transparent" />
              </div>

              {/* Corner accents */}
              <CornerAccent position="tr" />
              <CornerAccent position="bl" />

              {/* Name badge floating in */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="absolute bottom-8 left-6 bg-[var(--background)]/80 backdrop-blur-sm border border-[var(--border)] px-4 py-3"
              >
                <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--muted)] mb-0.5">AI Researcher</p>
                <p className="text-sm font-light text-[var(--foreground)] animate-flicker">Washington DC</p>
              </motion.div>
            </motion.div>

            {/* Bio text */}
            <div className="lg:pt-8">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2 }}
                className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-6"
              >
                Washington DC, USA
              </motion.p>

              <h2 className="text-3xl lg:text-4xl font-light text-[var(--foreground)] leading-tight mb-8">
                <SplitWords text="Nigel" delay={0.28} />
              </h2>

              {[
                { delay: 0.35, text: "My full name is Amos Nigel Funguriro and I am a researcher at The Catholic University of America with a strong interest in artificial intelligence, computer vision, and real-time machine learning systems." },
                { delay: 0.45, text: "My work focuses on developing intelligent, data-driven solutions that enable machines to perceive, analyze, and act on complex visual information in real time." },
                { delay: 0.55, text: "I also enjoy web development and creating digital systems that solve real-world problems — building things that work well and look exceptional." },
              ].map(({ delay, text }) => (
                <motion.p
                  key={delay}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay }}
                  className="text-base text-[var(--muted)] leading-relaxed mb-6 font-light"
                >
                  {text}
                </motion.p>
              ))}

              {/* Metadata grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.65 }}
                className="mt-10 pt-10 border-t border-[var(--border)]"
              >
                <DrawLine delay={0.65} className="mb-8 -mt-px" />
                <motion.div
                  className="grid grid-cols-2 gap-6"
                  variants={cardContainer}
                  initial="hidden"
                  animate="show"
                >
                  {[
                    { label: "Degree",     value: "Data Analytics" },
                    { label: "University", value: "Catholic Univ. of America" },
                    { label: "Focus",      value: "AI & Computer Vision" },
                    { label: "Status",     value: "Graduate Student" },
                  ].map(({ label, value }) => (
                    <motion.div
                      key={label}
                      variants={cardItem}
                      className="group"
                    >
                      <p className="text-[10px] tracking-widest uppercase text-[var(--muted)] mb-1">{label}</p>
                      <p className="text-sm text-[var(--foreground)] font-light group-hover:opacity-70 transition-opacity">{value}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Detail cards ── */}
        <section className="py-20 border-b border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-6">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-3 flex items-center gap-3"
            >
              <motion.span
                className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--muted)]"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: 0.5 }}
              />
              Life beyond the screen
            </motion.p>

            <DrawLine delay={0.1} className="mb-12" />

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border)]"
              variants={cardContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {details.map(({ icon: Icon, label, content }) => (
                <motion.div
                  key={label}
                  variants={cardItem}
                  whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
                  className="group bg-[var(--background)] p-8 flex flex-col gap-5 relative overflow-hidden cursor-default"
                >
                  {/* Left glow bar on hover */}
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--foreground)]"
                    initial={{ scaleY: 0 }}
                    whileHover={{ scaleY: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  <motion.div
                    className="w-9 h-9 border border-[var(--border)] group-hover:border-[var(--foreground)] flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon size={16} className="text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors duration-300" />
                  </motion.div>

                  <div>
                    <p className="text-[10px] tracking-widest uppercase text-[var(--muted)] mb-3">{label}</p>
                    <p className="text-sm text-[var(--muted)] leading-relaxed font-light">{content}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Spotify ── */}
        <section className="py-20 border-b border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-10 flex items-end justify-between"
            >
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-2 flex items-center gap-3">
                  <motion.span
                    className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  Currently listening
                </p>
                <h2 className="text-2xl font-light text-[var(--foreground)]">My Playlist</h2>
              </div>
              <Waveform />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="border border-[var(--border)] overflow-hidden relative"
              whileHover={{ borderColor: "var(--foreground)" }}
            >
              {/* Corner accents on spotify embed */}
              <CornerAccent position="tl" />
              <CornerAccent position="br" />
              <iframe
                src="https://open.spotify.com/embed/playlist/3cZIU2DZ4rprCb7nQ3QNXH?utm_source=generator&theme=0"
                width="100%"
                height="380"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                style={{ border: "none", display: "block" }}
              />
            </motion.div>
          </div>
        </section>

        {/* ── Instagram ── */}
        <section className="py-20 border-b border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
            >
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-2">Instagram</p>
                <h2 className="text-2xl font-light text-[var(--foreground)]">@nigel_amo</h2>
              </div>
              <motion.a
                href="https://www.instagram.com/nigel_amo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-2.5 border border-[var(--border)] text-xs tracking-widest uppercase text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Follow on Instagram
              </motion.a>
            </motion.div>

            {/* Photo grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[var(--border)]">
              {[
                { src: "/ig-gym.jpeg",    caption: "Staying sharp",          tag: "Fitness",       pos: "center top" },
                { src: "/ig-formal.jpeg", caption: "Always dressed for it",  tag: "Professional",  pos: "center 15%" },
                { src: "/ig-campus.jpeg", caption: "Catholic University",    tag: "Campus life",   pos: "center 20%" },
              ].map(({ src, caption, tag, pos }, i) => (
                <motion.a
                  key={i}
                  href="https://www.instagram.com/nigel_amo"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.12 }}
                  className="group relative aspect-[3/4] overflow-hidden block bg-[var(--card)]"
                >
                  {/* Photo */}
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <Image
                      src={src}
                      alt={caption}
                      fill
                      className="object-cover"
                      style={{ objectPosition: pos }}
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </motion.div>

                  {/* Dark overlay on hover */}
                  <motion.div
                    className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-2 px-4"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Instagram icon */}
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                    <p className="text-white text-xs text-center font-light leading-snug">{caption}</p>
                    <p className="text-white/50 text-[10px] tracking-widest uppercase">{tag}</p>
                  </motion.div>

                  {/* Tag badge (always visible, bottom-left) */}
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent translate-y-0 group-hover:opacity-0 transition-opacity duration-300">
                    <p className="text-white/80 text-[10px] tracking-widest uppercase">{tag}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* ── WhatsApp connect ── */}
        <section className="py-20 border-b border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-3 flex items-center gap-3">
                  <motion.span
                    className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  Instant connect
                </p>
                <h2 className="text-2xl lg:text-3xl font-light text-[var(--foreground)] leading-tight mb-4">
                  <SplitWords text="Let's talk directly" useInView delay={0.05} />
                </h2>
                <p className="text-sm text-[var(--muted)] leading-relaxed font-light">
                  Have a project in mind, a question about my research, or just want to say hello? Drop me a message on WhatsApp — I typically respond within a few hours.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="flex flex-col gap-4"
              >
                {/* WhatsApp */}
                <motion.a
                  href="https://wa.me/12272492922?text=Hi%20Nigel%2C%20I%20found%20you%20on%20your%20portfolio%20and%20would%20love%20to%20connect!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-5 border border-[var(--border)] bg-[var(--card)] hover:border-[var(--foreground)] hover:bg-[var(--background)] transition-all duration-300"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative w-11 h-11 flex items-center justify-center bg-[var(--foreground)] text-[var(--background)] flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                    </svg>
                    {/* Pulse ring on WhatsApp icon */}
                    <span className="pulse-ring text-green-500 opacity-60" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--foreground)]">Message on WhatsApp</p>
                    <p className="text-xs text-[var(--muted)] mt-0.5">Opens a chat with a pre-filled hello</p>
                  </div>
                  <motion.svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className="text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors flex-shrink-0"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </motion.svg>
                </motion.a>

                {/* Email */}
                <motion.a
                  href="mailto:hello@amonigel.com"
                  className="group flex items-center gap-4 p-5 border border-[var(--border)] bg-[var(--card)] hover:border-[var(--foreground)] hover:bg-[var(--background)] transition-all duration-300"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-11 h-11 flex items-center justify-center border border-[var(--border)] flex-shrink-0 group-hover:border-[var(--foreground)] transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--foreground)]">Send an email</p>
                    <p className="text-xs text-[var(--muted)] mt-0.5">hello@amonigel.com</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors flex-shrink-0">
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </motion.a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Closing quote ── */}
        <section className="py-24">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 0.15, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-7xl font-light text-[var(--foreground)] mb-6 leading-none select-none"
              aria-hidden="true"
            >
              "
            </motion.div>

            <p className="text-lg md:text-xl font-light text-[var(--foreground)] leading-relaxed mb-3">
              <SplitWords
                text="Build things that matter. Stay curious. Be kind."
                useInView
                delay={0.1}
              />
            </p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-xs tracking-[0.3em] uppercase text-[var(--muted)]"
            >
              — Nigel
            </motion.p>

            <DrawLine delay={1.0} className="mt-12 max-w-24 mx-auto" />
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
