"use client";

import { motion, Variants, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Shield, Globe, Clock,
  Building2, Brain, Lock, ExternalLink, ChevronDown,
  Fingerprint, Server, BarChart3, Smartphone, Cpu,
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";

/* ─── Helpers ───────────────────────────────────────────────────── */

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
    <motion.div className={`h-px bg-[var(--border)] origin-left ${className}`}
      initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
      transition={{ duration: 0.9, delay }} />
  );
}

function PulseDot({ color = "bg-sky-400" }: { color?: string }) {
  return (
    <motion.span className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${color}`}
      animate={{ opacity: [1, 0.2, 1], scale: [1, 1.5, 1] }}
      transition={{ duration: 2, repeat: Infinity }} />
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
  { value: "50+",  label: "Projects\nDelivered",       dot: "bg-sky-400"     },
  { value: "100+", label: "Clients\nServed",            dot: "bg-emerald-400" },
  { value: "8+",   label: "Industries\nTouched",        dot: "bg-violet-400"  },
  { value: "0",    label: "Projects\nAbandoned",        dot: "bg-amber-400"   },
];

type Status = "production" | "deployed" | "classified" | "research" | "live" | "active";

interface Project {
  id: string;
  title: string;
  client: string;
  period: string;
  category: string;
  status: Status;
  icon: React.ElementType;
  color: string;
  summary: string;
  detail: string;
  impact: string;
  stack: string[];
  classified?: boolean;
}

const FEATURED_PROJECTS: Project[] = [
  {
    id: "avatar",
    title: "Adaptive Emotion-Aware Multimodal AI Avatar",
    client: "The Catholic University of America",
    period: "2024 — Present",
    category: "AI Research · Affective Computing · Multimodal AI",
    status: "active",
    icon: Cpu,
    color: "bg-sky-400",
    summary: "Developing a human-centered multimodal AI avatar capable of interacting through speech and text, while generating emotionally adaptive and context-aware responses expressed via voice and facial animation — extending toward next-generation intelligent avatars relevant to NVIDIA platforms.",
    detail: "Unlike conventional AI avatars, this system introduces a novel emotional memory and reasoning layer that enables the avatar to detect user emotions from multimodal inputs (text and speech), track emotional patterns over time, and adapt responses based on both current and historical emotional states. The architecture fuses large language models with affective computing, real-time speech processing, and procedural facial animation — creating an avatar that does not just respond, but genuinely understands the emotional context of a conversation. This research aligns with and extends work in multimodal interactive AI and affective human-AI interaction explored by Professor Hanseok Ko and Jun, with direct relevance to NVIDIA's emerging intelligent avatar platforms.",
    impact: "Advancing the frontier of human-AI interaction through emotionally intelligent, memory-aware avatar systems — bridging academic research and production-grade AI deployment.",
    stack: ["PyTorch", "LLMs", "Speech Recognition", "Affective Computing", "Facial Animation", "Multimodal AI", "Emotion Detection", "Memory & Reasoning", "Python", "NVIDIA"],
  },
  {
    id: "payroll",
    title: "Enterprise Payroll Management System",
    client: "Softrite Private Limited",
    period: "2018 — 2023",
    category: "Enterprise SaaS · Fintech",
    status: "production",
    icon: Server,
    color: "bg-violet-400",
    summary: "A five-year engagement building and evolving a mission-critical payroll platform used by organisations across Zimbabwe — including banks, government bodies, and private enterprises.",
    detail: "I joined Softrite as an entry-level developer and grew into a senior engineering role through hands-on mentorship from Mike and a team of seasoned developers. I was responsible for architecting new system modules, building complex payroll calculation engines, managing tax and statutory compliance logic, and maintaining overall system performance under high-volume payroll runs. This project taught me that enterprise software is as much about discipline and precision as it is about code — a payroll error is not just a bug, it is someone's livelihood.",
    impact: "Thousands of employees paid accurately across Zimbabwe's top organisations. Zero production payroll errors under my watch.",
    stack: ["Java", "SQL Server", "System Architecture", "Payroll Logic", "Tax Compliance", "HR Tech", "Enterprise SaaS"],
  },
  {
    id: "biometric",
    title: "Biometric Time & Attendance System",
    client: "Multiple Enterprises · FBC Bank (POC)",
    period: "2020 — 2023",
    category: "Hardware Integration · Enterprise",
    status: "deployed",
    icon: Fingerprint,
    color: "bg-sky-400",
    summary: "Customised and deployed a biometric time and attendance platform across multiple major Zimbabwean enterprises, integrating hardware terminals with workforce management software.",
    detail: "Working closely with a biometric software supplier, I led the technical customisation of the platform for the Zimbabwean market — adapting it to local HR policies, shift structures, and compliance requirements. I personally managed the integration of various biometric terminal hardware (fingerprint, card, face recognition) into a unified attendance management system. A landmark deployment was at FBC Bank Limited as a Proof of Concept, validating the platform's enterprise readiness. The project spanned hardware installation, software integration, staff training, and post-deployment support.",
    impact: "Deployed across multiple notable enterprises. FBC Bank POC validated enterprise-grade capability.",
    stack: ["Biometric Hardware", "System Integration", "SQL", "Hardware APIs", "Workforce Management", "On-site Deployment"],
  },
  {
    id: "military",
    title: "Classified Defence Systems",
    client: "Government of Zimbabwe — Ministry of Defence",
    period: "Undisclosed",
    category: "National Security · Government",
    status: "classified",
    icon: Shield,
    color: "bg-rose-400",
    summary: "Contributed to non-disclosable military and defence projects for the Government of Zimbabwe under strict confidentiality agreements.",
    detail: "By nature, the specifics of this engagement cannot be disclosed. What can be said is that working on national security systems required a level of discipline, security awareness, and engineering rigour that surpasses typical commercial development. This experience instilled in me a deep respect for system integrity, access control, and the real-world consequences of software failure — lessons that inform every project I take on today.",
    impact: "National security infrastructure delivered on time, under strict confidentiality.",
    stack: ["██████████", "██████", "████████████", "█████████"],
    classified: true,
  },
  {
    id: "ai-portfolio",
    title: "AI-Powered Portfolio Platform",
    client: "Personal — amonigel.com",
    period: "2024 — Present",
    category: "AI Application · Full Stack",
    status: "live",
    icon: Brain,
    color: "bg-emerald-400",
    summary: "Designed and built a next-generation portfolio powered by RAG-based AI, real-time data integrations, and a fully custom design system — the site you are currently viewing.",
    detail: "This project showcases the full breadth of modern AI engineering: a conversational AI assistant trained on my professional data using Retrieval-Augmented Generation (RAG) with Pinecone vector storage and OpenAI, live GitHub activity feed, Google Reviews integration, dynamic animations with Framer Motion, and a dark-mode design system built entirely from scratch. Every section was crafted to demonstrate both technical capability and design sensibility — because great engineers should also build beautiful things.",
    impact: "A living demonstration of production-grade AI integration, full-stack engineering, and modern UX.",
    stack: ["Next.js 15", "TypeScript", "OpenAI", "Pinecone", "RAG", "Framer Motion", "Tailwind CSS", "Vercel"],
  },
];

const MORE_PROJECTS: {
  title: string; client: string; year: string; category: string;
  icon: React.ElementType; color: string; desc: string; stack: string[];
}[] = [
  {
    title: "Royal Harare Golf Club Website",
    client: "Royal Harare Golf Club",
    year: "2021",
    category: "Web Development",
    icon: Globe,
    color: "bg-emerald-400",
    desc: "Full website design and development for one of Zimbabwe's most prestigious golf clubs — a clean, membership-focused platform with event management and club information.",
    stack: ["Next.js", "CMS", "Responsive Design"],
  },
  {
    title: "African Sun Hotels Digital Platform",
    client: "African Sun",
    year: "2021",
    category: "Hospitality Tech",
    icon: Building2,
    color: "bg-amber-400",
    desc: "Digital presence and web platform development for African Sun, one of Zimbabwe's leading hospitality brands — optimised for bookings and brand showcasing.",
    stack: ["Web Development", "UI/UX", "CMS Integration"],
  },
  {
    title: "FBC Bank Digital Solutions",
    client: "FBC Bank Limited",
    year: "2022",
    category: "Banking · Fintech",
    icon: BarChart3,
    color: "bg-sky-400",
    desc: "Biometric attendance POC deployment and digital consulting for FBC Bank — a landmark proof-of-concept validating enterprise biometric infrastructure.",
    stack: ["Biometric Systems", "Enterprise Integration", "Banking Tech"],
  },
  {
    title: "Influencer & Creator Tech Stack",
    client: "Comic Elder · Gamu · Frets Donzvo + more",
    year: "2022 — Present",
    category: "Creator Economy",
    icon: Smartphone,
    color: "bg-violet-400",
    desc: "Platform management, monetisation strategy, account security, and audience growth systems for 9+ Zimbabwean content creators across Facebook, YouTube, Instagram, and TikTok.",
    stack: ["Meta Business Suite", "Monetisation", "Analytics", "Content Strategy"],
  },
  {
    title: "Government Digital Infrastructure",
    client: "Government of Zimbabwe",
    year: "2019 — 2021",
    category: "Public Sector",
    icon: Shield,
    color: "bg-rose-400",
    desc: "Digital systems and web infrastructure delivered for government agencies — combining security-first engineering with public-sector compliance requirements.",
    stack: ["Enterprise Systems", "Security", "Web Development"],
  },
  {
    title: "Quest Financial Services Platform",
    client: "Quest Financial Services",
    year: "2020",
    category: "Financial Services",
    icon: BarChart3,
    color: "bg-indigo-400",
    desc: "Digital consulting and web platform development for Quest Financial Services — modernising their client-facing digital presence and internal tooling.",
    stack: ["Web Development", "Digital Strategy", "UI/UX"],
  },
  {
    title: "Computer Vision Research System",
    client: "Catholic Univ. of America",
    year: "2024",
    category: "AI Research",
    icon: Brain,
    color: "bg-sky-400",
    desc: "Research-grade real-time object detection and video analysis pipeline using YOLO and PyTorch — part of ongoing graduate AI research at CUA.",
    stack: ["PyTorch", "YOLO", "OpenCV", "Python", "CUDA"],
  },
  {
    title: "Multi-Corporate Web Portfolio",
    client: "Nzira Travel · Rotary · Mahindra + more",
    year: "2019 — 2023",
    category: "Web Development",
    icon: Globe,
    color: "bg-emerald-400",
    desc: "Designed and delivered web platforms for over a dozen organisations across travel, automotive, non-profit, and services sectors throughout Zimbabwe.",
    stack: ["React", "WordPress", "Next.js", "Full Stack"],
  },
];

const STATUS_CONFIG: Record<Status, { label: string; dot: string; text: string }> = {
  active:     { label: "In Progress",    dot: "bg-sky-400",     text: "text-sky-400"     },
  production: { label: "In Production",  dot: "bg-emerald-400", text: "text-emerald-400" },
  deployed:   { label: "Deployed",       dot: "bg-sky-400",     text: "text-sky-400"     },
  classified: { label: "Classified",     dot: "bg-rose-400",    text: "text-rose-400"    },
  research:   { label: "Research",       dot: "bg-violet-400",  text: "text-violet-400"  },
  live:       { label: "Live",           dot: "bg-emerald-400", text: "text-emerald-400" },
};

/* ─── Featured project card ─────────────────────────────────────── */

function FeaturedCard({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const { icon: Icon, color, status, classified } = project;
  const st = STATUS_CONFIG[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="group border border-[var(--border)] bg-[var(--background)] hover:border-[var(--foreground)]/25 transition-colors duration-300 relative overflow-hidden"
    >
      {/* Top scan line on hover */}
      <motion.div className="absolute inset-x-0 top-0 h-px bg-[var(--foreground)] origin-left" initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.4 }} />

      {/* HUD corners */}
      <span className="absolute top-4 left-4 w-4 h-4 border-t border-l border-transparent group-hover:border-[var(--foreground)]/20 transition-all duration-300" />
      <span className="absolute top-4 right-4 w-4 h-4 border-t border-r border-transparent group-hover:border-[var(--foreground)]/20 transition-all duration-300" />
      <span className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-transparent group-hover:border-[var(--foreground)]/20 transition-all duration-300" />
      <span className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-transparent group-hover:border-[var(--foreground)]/20 transition-all duration-300" />

      {/* Index watermark */}
      <span className="absolute top-5 right-7 font-mono text-[11px] text-[var(--foreground)] opacity-[0.04] group-hover:opacity-[0.12] transition-opacity select-none">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="p-8 lg:p-10">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 border border-[var(--border)] group-hover:border-[var(--foreground)]/40 flex items-center justify-center flex-shrink-0 transition-all duration-300 relative">
              <Icon size={16} className="text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors duration-300" />
              <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${color}`} />
            </div>
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--muted)] mb-1">{project.category}</p>
              <h3 className="text-base lg:text-lg font-light text-[var(--foreground)] leading-snug">{project.title}</h3>
            </div>
          </div>

          {/* Status badge */}
          <div className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border)]`}>
            <motion.span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
            <span className={`font-mono text-[9px] tracking-widest uppercase ${st.text}`}>{st.label}</span>
          </div>
        </div>

        {/* Client + period */}
        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-[var(--border)]">
          <span className="text-[10px] tracking-widest uppercase text-[var(--muted)] flex items-center gap-1.5">
            <span className={`w-1 h-1 rounded-full ${color} inline-block`} />
            {project.client}
          </span>
          <span className="w-px h-3 bg-[var(--border)]" />
          <span className="font-mono text-[9px] tracking-widest uppercase text-[var(--muted)]">{project.period}</span>
        </div>

        {/* Summary */}
        <p className="text-sm text-[var(--muted)] leading-relaxed font-light mb-4">{project.summary}</p>

        {/* Expandable detail */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden"
            >
              <p className="text-xs text-[var(--muted)] leading-relaxed font-light mb-5 opacity-80">{project.detail}</p>

              {/* Impact */}
              <div className="flex items-start gap-3 p-4 border border-[var(--border)] mb-5">
                <span className={`w-1.5 h-1.5 rounded-full ${color} flex-shrink-0 mt-1`} />
                <p className="text-xs text-[var(--foreground)] font-light leading-relaxed">{project.impact}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.stack.map(tag => (
            <span key={tag}
              className={`font-mono text-[9px] tracking-widest uppercase px-2.5 py-1 border border-[var(--border)] transition-colors duration-300 ${classified ? "text-[var(--muted)] opacity-50" : "text-[var(--muted)] group-hover:border-[var(--foreground)]/20"}`}>
              {tag}
            </span>
          ))}
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-200"
        >
          <span>{expanded ? "Show less" : "Read more"}</span>
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown size={11} />
          </motion.span>
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Small project card ─────────────────────────────────────────── */

function SmallCard({ p, i }: { p: typeof MORE_PROJECTS[0]; i: number }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4, transition: { type: "spring", stiffness: 280 } }}
      className="group bg-[var(--background)] p-6 flex flex-col gap-4 relative overflow-hidden cursor-default border-b border-r border-[var(--border)]"
    >
      <motion.div className="absolute inset-x-0 top-0 h-px bg-[var(--foreground)] origin-left" initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.3 }} />
      <span className="absolute top-3 left-3 w-3 h-3 border-t border-l border-transparent group-hover:border-[var(--foreground)]/20 transition-all duration-300" />
      <span className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-transparent group-hover:border-[var(--foreground)]/20 transition-all duration-300" />
      <span className="absolute top-4 right-5 font-mono text-[10px] text-[var(--foreground)] opacity-[0.04] group-hover:opacity-[0.14] transition-opacity select-none">
        {String(i + 1).padStart(2, "0")}
      </span>

      <div className="flex items-center justify-between">
        <div className="w-9 h-9 border border-[var(--border)] group-hover:border-[var(--foreground)]/40 flex items-center justify-center flex-shrink-0 transition-all duration-300 relative">
          <p.icon size={14} className="text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors duration-300" />
          <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${p.color}`} />
        </div>
        <span className="font-mono text-[9px] tracking-widest uppercase text-[var(--muted)] opacity-60">{p.year}</span>
      </div>

      <div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--muted)] mb-1">{p.category}</p>
        <p className="text-sm font-light text-[var(--foreground)] leading-snug mb-1">{p.title}</p>
        <p className="text-[10px] tracking-widest uppercase text-[var(--muted)] flex items-center gap-1.5 mb-3">
          <span className={`w-1 h-1 rounded-full inline-block ${p.color}`} />
          {p.client}
        </p>
        <p className="text-xs text-[var(--muted)] leading-relaxed font-light line-clamp-3">{p.desc}</p>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-[var(--border)]">
        {p.stack.map(tag => (
          <span key={tag} className="font-mono text-[8px] tracking-widest uppercase px-2 py-0.5 border border-[var(--border)] text-[var(--muted)]">{tag}</span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */

export default function ProjectsPage() {
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
                <motion.span whileHover={{ x: -3 }} transition={{ type: "spring", stiffness: 400 }}><ArrowLeft size={12} /></motion.span>
                Back
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}
              className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-3 flex items-center gap-2"
            >
              <PulseDot color="bg-sky-400" />
              Selected work
            </motion.p>

            <h1 className="text-4xl lg:text-6xl font-light text-[var(--foreground)] leading-none tracking-tight mb-6">
              <SplitWords text="Projects &" delay={0.12} />
              <br />
              <span className="opacity-30"><SplitWords text="Case Studies" delay={0.3} /></span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}
              className="text-sm text-[var(--muted)] font-light max-w-2xl leading-relaxed mb-12"
            >
              From enterprise payroll systems trusted by Zimbabwe's top banks and government bodies, to AI-powered applications at the frontier of machine learning — every project here represents a real problem solved, a real client served, and real impact delivered.
            </motion.p>

            {/* Stats */}
            <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border)]"
              variants={container} initial="hidden" animate="show">
              {STATS.map(({ value, label, dot }) => (
                <motion.div key={label} variants={fadeUp}
                  className="group bg-[var(--background)] px-7 py-6 relative overflow-hidden">
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

        {/* ── Featured projects ── */}
        <section className="py-20 border-b border-[var(--border)] relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.03),transparent_65%)]" />
          <div className="max-w-6xl mx-auto px-6">

            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-14">
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-3 flex items-center gap-2">
                <PulseDot color="bg-violet-400" />
                Highlighted work
              </p>
              <h2 className="text-2xl lg:text-3xl font-light text-[var(--foreground)]">
                Featured projects<br />
                <span className="opacity-30">click "read more" for the full story</span>
              </h2>
            </motion.div>

            <DrawLine className="mb-12" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {FEATURED_PROJECTS.map((p, i) => (
                <FeaturedCard key={p.id} project={p} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Classified banner ── */}
        <section className="py-10 border-b border-[var(--border)] relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.03),transparent_60%)]" />
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-[var(--border)] px-7 py-5 relative overflow-hidden"
            >
              <motion.div className="absolute inset-x-0 top-0 h-px bg-rose-400/30 origin-left" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} />
              <Lock size={14} className="text-rose-400 flex-shrink-0 opacity-70" />
              <p className="text-xs text-[var(--muted)] font-light leading-relaxed">
                <span className="text-[var(--foreground)] font-light">NDA & Confidentiality Notice —&nbsp;</span>
                Several projects in my portfolio are covered by non-disclosure agreements with government bodies and corporate clients. Full technical details, client names, and outcomes for those engagements cannot be shared publicly. References available upon request.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── More projects grid ── */}
        <section className="py-20 border-b border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-6">

            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-14">
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-3 flex items-center gap-2">
                <PulseDot color="bg-emerald-400" />
                More work
              </p>
              <h2 className="text-2xl lg:text-3xl font-light text-[var(--foreground)]">
                Additional projects<br />
                <span className="opacity-30">across industries and technologies</span>
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l border-t border-[var(--border)]"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.05 }}
            >
              {MORE_PROJECTS.map((p, i) => (
                <SmallCard key={p.title} p={p} i={i} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Collaborate CTA ── */}
        <section className="py-24 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.04),transparent_65%)]" />
          <div className="max-w-3xl mx-auto px-6 text-center">

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 0.06, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-8xl font-light text-[var(--foreground)] mb-4 leading-none select-none"
              aria-hidden
            >✦</motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}
              className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-5 flex items-center justify-center gap-2"
            >
              <PulseDot color="bg-emerald-400" />
              Have a project in mind?
            </motion.p>

            <h2 className="text-3xl lg:text-4xl font-light text-[var(--foreground)] leading-tight mb-6">
              <SplitWords text="Your project could be" useInView delay={0.1} />
              <br />
              <span className="opacity-30"><SplitWords text="the next case study here." useInView delay={0.4} /></span>
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.6 }}
              className="text-sm text-[var(--muted)] font-light max-w-md mx-auto leading-relaxed mb-10"
            >
              I bring the same dedication to every engagement — from a single-page website to a multi-year enterprise system. If you have a project, let's talk.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.75 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 bg-[var(--foreground)] text-[var(--background)] text-xs tracking-widest uppercase relative overflow-hidden group inline-flex items-center gap-2"
              >
                <motion.span className="absolute inset-0 bg-white/10 origin-left" initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.3 }} />
                <span className="relative">Let's collaborate</span>
                <motion.span className="relative" animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ArrowRight size={12} />
                </motion.span>
              </motion.a>
              <motion.a
                href="/services"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 border border-[var(--border)] text-[var(--foreground)] text-xs tracking-widest uppercase hover:border-[var(--foreground)] transition-colors inline-flex items-center gap-2"
              >
                <ExternalLink size={12} />
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
