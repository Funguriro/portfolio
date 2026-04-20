"use client";

import { motion, Variants, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Cpu, Brain, Eye, Zap,
  Database, Globe, Users, Star, Code2, Layers,
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";

/* ─── Helpers ──────────────────────────────────────────────────── */

function SplitWords({ text, className, delay = 0, useInView = false }: {
  text: string; className?: string; delay?: number; useInView?: boolean;
}) {
  const words = text.split(" ");
  const anim = useInView
    ? { initial: { opacity: 0, y: 28, filter: "blur(10px)" }, whileInView: { opacity: 1, y: 0, filter: "blur(0px)" }, viewport: { once: true } }
    : { initial: { opacity: 0, y: 28, filter: "blur(10px)" }, animate: { opacity: 1, y: 0, filter: "blur(0px)" } };
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <motion.span key={i} className="inline-block" {...anim} transition={{ duration: 0.55, delay: delay + i * 0.09 }}>
          {word}&nbsp;
        </motion.span>
      ))}
    </span>
  );
}

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

function PulseDot({ color = "bg-sky-400" }: { color?: string }) {
  return (
    <motion.span
      className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${color}`}
      animate={{ opacity: [1, 0.2, 1], scale: [1, 1.5, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  );
}

/* ─── Variants ──────────────────────────────────────────────────── */

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.55 } },
};

/* ─── Data ──────────────────────────────────────────────────────── */

const STATS = [
  { value: "8+",   label: "Years of\nSoftware Dev",    dot: "bg-sky-400"     },
  { value: "100+", label: "Clients\nServed",            dot: "bg-emerald-400" },
  { value: "50+",  label: "Projects\nDelivered",        dot: "bg-violet-400"  },
  { value: "5",    label: "Years in\nEnterprise SaaS",  dot: "bg-amber-400"   },
];

const TIMELINE = [
  {
    year:    "2016",
    period:  "2016 — 2018",
    role:    "Freelance Web Developer",
    org:     "Self-Employed · Undergraduate",
    location:"Zimbabwe",
    color:   "bg-sky-400",
    tags:    ["HTML/CSS", "JavaScript", "PHP", "WordPress", "Client Relations"],
    summary: "It started in college — long before AI was a household word. While pursuing my undergraduate degree I began building websites for local businesses, learning not just code but something far more valuable: how to listen to a client, translate their vision into a digital product, and deliver work that exceeded what they imagined.",
    detail:  "Those early years forged a discipline I carry into every engagement today. I learned that technology is only as powerful as the human conversation behind it. Over 100 clients later, most of my work still comes from referrals — because I believe the best marketing is a client who won't stop talking about what you built for them.",
    highlight: "First 20+ clients. 100% referral growth.",
  },
  {
    year:    "2018",
    period:  "2018 — 2023",
    role:    "Software Engineer — Payroll Systems",
    org:     "Softrite Payroll Systems",
    location:"Zimbabwe",
    color:   "bg-violet-400",
    tags:    ["Java", "SQL", "System Architecture", "Enterprise SaaS", "Payroll Logic", "HR Tech"],
    summary: "For five years I engineered the backbone of payroll infrastructure used by organisations across Zimbabwe — including government institutions, banks, and private sector enterprises. This wasn't just CRUD development; it was mission-critical software where an off-by-one error meant someone's salary was wrong.",
    detail:  "Working in enterprise fintech taught me to build with precision, document with discipline, and think in systems. At the same time, I was running a parallel track — continuing to take on web development contracts, influencer management, and corporate digital consulting. I became fluent in context-switching between deep technical work and client-facing strategy.",
    highlight: "5-year enterprise build. Zero payroll errors in production.",
  },
  {
    year:    "2021",
    period:  "2021 — 2023",
    role:    "Independent Digital Consultant & Full Stack Engineer",
    org:     "Self-Employed · Consulting",
    location:"Zimbabwe & Remote",
    color:   "bg-emerald-400",
    tags:    ["Next.js", "React", "Node.js", "Digital Strategy", "Influencer Management", "Corporate Advisory"],
    summary: "I expanded beyond product engineering into strategic digital consulting — partnering with corporates like Quest Financial Services, FBC Bank, the Government of Zimbabwe, African Sun Hotels, Mahindra Zimbabwe, and more. My scope grew from writing code to shaping how organisations presented themselves online and used digital tools to drive outcomes.",
    detail:  "Simultaneously I stepped into artist and influencer management, growing social media presence for prominent Zimbabwean creators. This dual-track work — technical and human — reinforced a belief I hold deeply: the best engineers are also great communicators. You cannot build the right thing if you don't understand people.",
    highlight: "11+ corporate clients. Multi-industry reach.",
  },
  {
    year:    "2023",
    period:  "2023 — Present",
    role:    "AI Researcher & Graduate Student",
    org:     "The Catholic University of America",
    location:"Washington, DC",
    color:   "bg-amber-400",
    tags:    ["Computer Vision", "PyTorch", "LLMs", "RAG", "AI Agents", "Real-time ML", "Data Analytics", "Research"],
    summary: "I moved to Washington DC to pursue graduate studies in Data Analytics — but the real focus has been building at the frontier of AI. My research sits at the intersection of computer vision, real-time machine learning, and intelligent systems: teaching machines to perceive and act on the world at human-level speed and accuracy.",
    detail:  "This phase has been transformative. I am not just studying AI — I am actively building with it: designing RAG-powered applications, training custom vision models, deploying autonomous AI agents, and applying the full stack of modern AI (LLMs, vector embeddings, multimodal systems) to real-world problems. Every line of research connects back to tangible, deployable impact.",
    highlight: "Graduate research · Frontier AI systems.",
  },
];

const AI_CAPABILITIES = [
  { icon: Brain,    label: "Large Language Models",        desc: "GPT-4, Claude, Gemini — prompt engineering, fine-tuning, and production deployment of LLM-powered features." },
  { icon: Database, label: "RAG & Vector Search",          desc: "Retrieval-Augmented Generation pipelines with Pinecone, pgvector, and semantic embeddings for intelligent, grounded responses." },
  { icon: Eye,      label: "Computer Vision",              desc: "Real-time object detection, image classification, and video analysis using YOLO, PyTorch, and OpenCV at inference speed." },
  { icon: Zap,      label: "AI Agents & Automation",       desc: "Agentic systems with tool use, multi-step reasoning, and autonomous execution built on LangChain and LangGraph." },
  { icon: Layers,   label: "MLOps & Deployment",           desc: "End-to-end ML pipelines, model versioning, monitoring, and scalable cloud deployment on AWS and GCP." },
  { icon: Cpu,      label: "Generative AI Integration",    desc: "Embedding generative capabilities — text, image, code — into production products via APIs and custom fine-tuned models." },
];

const DIFFERENTIATORS = [
  {
    icon: Star,
    title: "Reference-First Reputation",
    desc: "Over 100 clients — and the majority found me through someone I'd already impressed. I don't chase projects; they find me because my work speaks for itself long after delivery.",
  },
  {
    icon: Users,
    title: "Customer Experience, Not Just Service",
    desc: "I make a deliberate distinction: service is transactional, experience is transformational. Every client interaction is designed to leave a lasting impression — not just a completed ticket.",
  },
  {
    icon: Code2,
    title: "Full Stack AI Engineer",
    desc: "I bridge the gap between research-grade AI and production-ready engineering. I don't just prototype — I architect, build, and ship systems that work in the real world under real conditions.",
  },
  {
    icon: Globe,
    title: "Multi-Industry Depth",
    desc: "From government payroll to hospitality to influencer tech — my exposure across industries means I bring cross-domain pattern recognition that pure specialists often miss.",
  },
];

const BUZZWORDS = [
  "Large Language Models (LLMs)", "Retrieval-Augmented Generation", "AI Agents",
  "Computer Vision", "Multimodal AI", "Transformer Architecture",
  "Vector Embeddings", "Real-time Inference", "Fine-Tuning",
  "Prompt Engineering", "MLOps", "Agentic Workflows",
  "Semantic Search", "Generative AI", "Edge AI",
  "LangChain / LangGraph", "PyTorch", "OpenAI API",
];

/* ─── Timeline entry ────────────────────────────────────────────── */

function TimelineEntry({ entry, index }: { entry: typeof TIMELINE[0]; index: number }) {
  const isEven = index % 2 === 0;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const lineH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="grid grid-cols-[1fr_auto_1fr] gap-0 items-start">

      {/* Left content */}
      <div className={`pb-16 ${isEven ? "pr-10" : "opacity-0 pointer-events-none"}`}>
        {isEven && (
          <motion.div
            initial={{ opacity: 0, x: -24, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="group border border-[var(--border)] p-7 bg-[var(--background)] hover:border-[var(--foreground)]/30 transition-colors duration-300 relative overflow-hidden cursor-default"
          >
            <EntryCard entry={entry} />
          </motion.div>
        )}
      </div>

      {/* Center spine */}
      <div className="flex flex-col items-center relative w-16">
        {/* Year label */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center z-10 mb-3"
        >
          <span className={`w-3 h-3 rounded-full ${entry.color} flex-shrink-0 shadow-lg`} />
          <motion.span
            className="font-mono text-[9px] tracking-widest text-[var(--muted)] mt-2 uppercase"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.4 }}
          >
            {entry.year}
          </motion.span>
        </motion.div>

        {/* Animated vertical line */}
        <div className="relative w-px flex-1 bg-[var(--border)] min-h-[100px]">
          <motion.div
            className={`absolute top-0 left-0 w-full ${entry.color} opacity-40`}
            style={{ height: lineH }}
          />
        </div>
      </div>

      {/* Right content */}
      <div className={`pb-16 ${!isEven ? "pl-10" : "opacity-0 pointer-events-none"}`}>
        {!isEven && (
          <motion.div
            initial={{ opacity: 0, x: 24, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="group border border-[var(--border)] p-7 bg-[var(--background)] hover:border-[var(--foreground)]/30 transition-colors duration-300 relative overflow-hidden cursor-default"
          >
            <EntryCard entry={entry} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

function EntryCard({ entry }: { entry: typeof TIMELINE[0] }) {
  return (
    <>
      {/* Top accent */}
      <motion.div
        className="absolute inset-x-0 top-0 h-px bg-[var(--foreground)] origin-left"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.35 }}
      />
      {/* HUD corners */}
      <span className="absolute top-3 left-3 w-3 h-3 border-t border-l border-transparent group-hover:border-[var(--foreground)]/20 transition-all duration-300" />
      <span className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-transparent group-hover:border-[var(--foreground)]/20 transition-all duration-300" />

      {/* Period + location */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--muted)]">{entry.period}</span>
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--muted)] opacity-60">{entry.location}</span>
      </div>

      {/* Role */}
      <h3 className="text-base font-light text-[var(--foreground)] mb-1 leading-snug">{entry.role}</h3>
      <p className={`text-[10px] tracking-[0.2em] uppercase mb-5 flex items-center gap-1.5`}>
        <span className={`w-1.5 h-1.5 rounded-full inline-block ${entry.color}`} />
        <span className="text-[var(--muted)]">{entry.org}</span>
      </p>

      <p className="text-xs text-[var(--muted)] leading-relaxed font-light mb-3">{entry.summary}</p>
      <p className="text-xs text-[var(--muted)] leading-relaxed font-light opacity-70 mb-5">{entry.detail}</p>

      {/* Highlight */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 border border-[var(--border)] mb-5`}>
        <span className={`w-1 h-1 rounded-full inline-block ${entry.color}`} />
        <span className="text-[9px] tracking-widest uppercase text-[var(--muted)]">{entry.highlight}</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {entry.tags.map(tag => (
          <span key={tag} className="font-mono text-[8px] tracking-widest uppercase px-2 py-1 border border-[var(--border)] text-[var(--muted)] hover:border-[var(--foreground)]/30 transition-colors">
            {tag}
          </span>
        ))}
      </div>
    </>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */

export default function ExperiencePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--background)]">

        {/* ── Header ── */}
        <section className="pt-32 pb-16 border-b border-[var(--border)] relative overflow-hidden">
          <div className="pointer-events-none absolute top-0 right-0 w-[600px] h-[320px] bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.05),transparent_70%)]" />
          <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[200px] bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.04),transparent_70%)]" />

          <div className="max-w-6xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              <Link href="/" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-10">
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
              className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-3 flex items-center gap-2"
            >
              <PulseDot color="bg-violet-400" />
              Career journey
            </motion.p>

            <h1 className="text-4xl lg:text-6xl font-light text-[var(--foreground)] leading-none tracking-tight mb-6">
              <SplitWords text="8 Years of" delay={0.12} />
              <br />
              <span className="opacity-30">
                <SplitWords text="Building what matters" delay={0.3} />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="text-sm text-[var(--muted)] font-light max-w-2xl leading-relaxed mb-12"
            >
              From a college dorm room in Zimbabwe to the frontlines of AI research in Washington DC — I have spent eight years at the intersection of software engineering, client success, and now, artificial intelligence. Every project has been an opportunity to leave something better than I found it.
            </motion.p>

            {/* Stats strip */}
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border)]"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {STATS.map(({ value, label, dot }) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  className="group bg-[var(--background)] px-7 py-6 relative overflow-hidden"
                >
                  <motion.div className="absolute left-0 top-0 bottom-0 w-px bg-[var(--foreground)] origin-top" initial={{ scaleY: 0 }} whileHover={{ scaleY: 1 }} transition={{ duration: 0.25 }} />
                  <p className="text-3xl font-light text-[var(--foreground)] leading-none mb-2">{value}</p>
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--muted)] whitespace-pre-line flex items-center gap-1.5">
                    <span className={`w-1 h-1 rounded-full inline-block ${dot}`} />
                    {label}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <DrawLine delay={0.9} className="mt-12" />
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className="py-20 border-b border-[var(--border)] relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.03),transparent_65%)]" />

          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-3 flex items-center gap-2">
                <PulseDot color="bg-violet-400" />
                Career timeline
              </p>
              <h2 className="text-2xl lg:text-3xl font-light text-[var(--foreground)]">
                The journey so far<br />
                <span className="opacity-30">each chapter built on the last</span>
              </h2>
            </motion.div>

            <DrawLine className="mb-16" />

            {/* Desktop alternating timeline */}
            <div className="hidden lg:block">
              {TIMELINE.map((entry, i) => (
                <TimelineEntry key={entry.year} entry={entry} index={i} />
              ))}
            </div>

            {/* Mobile stacked timeline */}
            <div className="lg:hidden flex flex-col gap-6">
              {TIMELINE.map((entry, i) => (
                <motion.div
                  key={entry.year}
                  initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                  className="group border border-[var(--border)] p-6 bg-[var(--background)] hover:border-[var(--foreground)]/30 transition-colors duration-300 relative overflow-hidden"
                >
                  <EntryCard entry={entry} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AI Capabilities ── */}
        <section className="py-20 border-b border-[var(--border)] relative overflow-hidden">
          <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[300px] bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.04),transparent_70%)]" />

          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
            >
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-3 flex items-center gap-2">
                  <PulseDot color="bg-sky-400" />
                  Current AI stack
                </p>
                <h2 className="text-2xl lg:text-3xl font-light text-[var(--foreground)]">
                  Building at the frontier<br />
                  <span className="opacity-30">of modern AI</span>
                </h2>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex-shrink-0 border border-[var(--border)] px-4 py-3 text-right"
              >
                <p className="text-[10px] tracking-widest uppercase text-[var(--muted)] mb-1 flex items-center justify-end gap-1.5">
                  <PulseDot color="bg-emerald-400" />
                  Active research
                </p>
                <p className="text-xs font-light text-[var(--foreground)]">Catholic Univ. of America</p>
              </motion.div>
            </motion.div>

            <DrawLine className="mb-12" />

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border)]"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.05 }}
            >
              {AI_CAPABILITIES.map(({ icon: Icon, label, desc }) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  whileHover={{ y: -4, transition: { type: "spring", stiffness: 280 } }}
                  className="group bg-[var(--background)] p-8 flex flex-col gap-4 relative overflow-hidden cursor-default"
                >
                  <motion.div className="absolute left-0 top-0 bottom-0 w-px bg-[var(--foreground)] origin-top" initial={{ scaleY: 0 }} whileHover={{ scaleY: 1 }} transition={{ duration: 0.25 }} />
                  <span className="absolute top-4 right-5 text-[10px] font-mono text-[var(--foreground)] opacity-[0.05] group-hover:opacity-[0.15] transition-opacity select-none">AI</span>

                  <div className="w-10 h-10 border border-[var(--border)] group-hover:border-[var(--foreground)]/40 flex items-center justify-center flex-shrink-0 transition-all duration-300">
                    <Icon size={15} className="text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-sm font-light text-[var(--foreground)] mb-2 leading-snug">{label}</p>
                    <p className="text-xs text-[var(--muted)] leading-relaxed font-light">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Buzzword ticker */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 pt-8 border-t border-[var(--border)]"
            >
              <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--muted)] mb-4 flex items-center gap-2">
                <PulseDot color="bg-sky-400" />
                Technologies & concepts in active use
              </p>
              <div className="flex flex-wrap gap-2">
                {BUZZWORDS.map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    whileHover={{ y: -2, transition: { type: "spring", stiffness: 300 } }}
                    className="font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 border border-[var(--border)] text-[var(--muted)] hover:border-[var(--foreground)]/40 hover:text-[var(--foreground)] transition-all duration-200 cursor-default"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── What makes me different ── */}
        <section className="py-20 border-b border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-6">

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-14"
            >
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-3 flex items-center gap-2">
                <PulseDot color="bg-amber-400" />
                Differentiators
              </p>
              <h2 className="text-2xl lg:text-3xl font-light text-[var(--foreground)]">
                Why clients choose me<br />
                <span className="opacity-30">and keep coming back</span>
              </h2>
            </motion.div>

            <DrawLine className="mb-12" />

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border)]"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
            >
              {DIFFERENTIATORS.map(({ icon: Icon, title, desc }) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  whileHover={{ y: -4, transition: { type: "spring", stiffness: 280 } }}
                  className="group bg-[var(--background)] p-9 flex gap-6 relative overflow-hidden cursor-default"
                >
                  <motion.div className="absolute left-0 top-0 bottom-0 w-px bg-[var(--foreground)] origin-top" initial={{ scaleY: 0 }} whileHover={{ scaleY: 1 }} transition={{ duration: 0.25 }} />
                  <span className="absolute top-4 right-5 w-3 h-3 border-t border-r border-transparent group-hover:border-[var(--foreground)]/20 transition-all duration-300" />
                  <span className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-transparent group-hover:border-[var(--foreground)]/20 transition-all duration-300" />

                  <div className="w-10 h-10 border border-[var(--border)] group-hover:border-[var(--foreground)]/40 flex items-center justify-center flex-shrink-0 transition-all duration-300 self-start mt-1">
                    <Icon size={15} className="text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-light text-[var(--foreground)] mb-2 leading-snug">{title}</p>
                    <p className="text-xs text-[var(--muted)] leading-relaxed font-light">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Philosophy quote ── */}
        <section className="py-20 border-b border-[var(--border)] relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.03),transparent_60%)]" />
          <div className="max-w-4xl mx-auto px-6">

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 0.05, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-8xl font-serif text-[var(--foreground)] leading-none select-none mb-6"
              aria-hidden
            >
              "
            </motion.div>

            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-xl lg:text-2xl font-light text-[var(--foreground)] leading-relaxed mb-6"
            >
              I believe God gave me the talent to do my work in a way that leaves a lasting feel — so that people will always remember my name when they want to work on similar projects. I have been at the intersection of software engineering and client success. I value customer experience over customer service.
            </motion.blockquote>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-xs tracking-[0.3em] uppercase text-[var(--muted)]"
            >
              — Amos Nigel Funguriro
            </motion.p>

            <DrawLine delay={0.6} className="mt-10 max-w-24" />
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.04),transparent_65%)]" />

          <div className="max-w-3xl mx-auto px-6 text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-5 flex items-center justify-center gap-2"
            >
              <PulseDot color="bg-emerald-400" />
              Let's collaborate
            </motion.p>

            <h2 className="text-3xl lg:text-4xl font-light text-[var(--foreground)] leading-tight mb-6">
              <SplitWords text="Eight years of experience." useInView delay={0.1} />
              <br />
              <span className="opacity-30">
                <SplitWords text="Your project is next." useInView delay={0.4} />
              </span>
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-sm text-[var(--muted)] font-light max-w-md mx-auto leading-relaxed mb-10"
            >
              Whether you need an AI-powered product, a full-stack web application, or a strategic digital partner who communicates like a human — let's talk.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.75 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 bg-[var(--foreground)] text-[var(--background)] text-xs tracking-widest uppercase relative overflow-hidden group inline-flex items-center gap-2"
              >
                <motion.span className="absolute inset-0 bg-white/10 origin-left" initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.3 }} />
                <span className="relative">Get in touch</span>
                <motion.span className="relative" animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ArrowRight size={12} />
                </motion.span>
              </motion.a>
              <motion.a
                href="/services"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 border border-[var(--border)] text-[var(--foreground)] text-xs tracking-widest uppercase hover:border-[var(--foreground)] transition-colors"
              >
                View services
              </motion.a>
            </motion.div>

            <DrawLine delay={0.9} className="mt-16 max-w-24 mx-auto" />
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
