"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Globe, Smartphone, Workflow, Bot,
  BarChart3, Eye, Users, Music, Headphones,
  ArrowRight, CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";

/* ─── Reusable helpers ──────────────────────────────────────────── */

function SplitWords({
  text, className, delay = 0, useInView = false,
}: {
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
      className={`inline-block w-1.5 h-1.5 rounded-full ${color}`}
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
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.55 } },
};

/* ─── Data ──────────────────────────────────────────────────────── */

const CORE_SERVICES = [
  {
    icon: Globe,
    title: "Modern AI Website Development",
    tagline: "Intelligent websites that think and adapt",
    desc: "I design and build full-stack web applications that go beyond static pages — integrating RAG-powered search, conversational AI chatbots, smart content personalization, and real-time data features. Every site is engineered for performance, accessibility, and scalable deployment on cloud infrastructure.",
    detail: "Whether you need a portfolio, SaaS platform, or enterprise portal, I handle everything from UI design to API integration and deployment — shipping production-ready products that impress users and perform at scale.",
    stack: ["Next.js", "React", "TypeScript", "OpenAI", "Pinecone", "PostgreSQL", "Vercel"],
    accent: "sky",
  },
  {
    icon: Smartphone,
    title: "App Development",
    tagline: "Cross-platform apps built for the real world",
    desc: "From concept to App Store, I build mobile and progressive web applications using React Native and Next.js with cloud-native backends. I architect clean, maintainable codebases with solid authentication, real-time sync, push notifications, and offline support baked in from day one.",
    detail: "My apps are built with the end user in mind — fast, intuitive, and rock-solid across iOS, Android, and web. Whether a startup MVP or a feature extension, I ship apps that feel native and work reliably.",
    stack: ["React Native", "Expo", "Next.js", "Firebase", "Supabase", "REST / GraphQL"],
    accent: "indigo",
  },
  {
    icon: Workflow,
    title: "AI Automation & Pipeline Engineering",
    desc: "I build end-to-end machine learning pipelines that ingest, clean, transform, and serve data at scale. From scheduled ETL workflows to real-time streaming pipelines, I eliminate manual processes and create systems that run autonomously — freeing your team to focus on decisions, not data wrangling.",
    tagline: "From raw data to decisions — automated",
    detail: "Using tools like Apache Airflow, LangChain, and FastAPI, I architect robust automation systems that integrate with your existing stack and scale without friction. I've built pipelines for financial analytics, media monitoring, and computer vision data flows.",
    stack: ["Python", "Airflow", "LangChain", "FastAPI", "Docker", "AWS / GCP", "Kafka"],
    accent: "violet",
  },
  {
    icon: Bot,
    title: "AI Agents",
    tagline: "Autonomous systems that reason and execute",
    desc: "I design and deploy AI agents capable of multi-step reasoning, tool use, and autonomous task execution. These aren't simple chatbots — they're intelligent systems that can research, plan, make decisions, and interact with APIs, databases, and external services on your behalf.",
    detail: "Applications include customer support automation, research assistants, operations bots, and complex workflow orchestration. Agents are built with safety guardrails, observability, and fallback logic to ensure reliable production performance.",
    stack: ["OpenAI", "LangChain", "LangGraph", "Python", "Function Calling", "Vector DBs"],
    accent: "emerald",
  },
  {
    icon: BarChart3,
    title: "Data Analytics & Visualization",
    tagline: "Turn raw numbers into clear strategy",
    desc: "I transform messy, siloed data into clean, interactive intelligence — building dashboards, reporting pipelines, and predictive models that surface the insights your business needs to act faster and smarter. From one-off analyses to fully automated BI systems, I work with your data where it lives.",
    detail: "My analytics work covers exploratory data analysis, statistical modelling, KPI dashboards, and ML-based forecasting. I present findings clearly — whether for executives, engineers, or investors — ensuring insight drives action.",
    stack: ["Python", "Pandas", "SQL", "Tableau", "Power BI", "D3.js", "Scikit-learn"],
    accent: "amber",
  },
  {
    icon: Eye,
    title: "Computer Vision Solutions",
    tagline: "Teaching machines to see and understand",
    desc: "I build real-time image recognition, object detection, video analysis, and facial recognition systems using state-of-the-art deep learning architectures. My CV systems are optimized for both research accuracy and production-grade latency — deployed as APIs, edge services, or embedded applications.",
    detail: "From YOLO-based detection pipelines to custom CNN classifiers trained on your domain data, I deliver CV solutions that work reliably in real conditions. Use cases include security surveillance, quality inspection, sports analytics, and medical imaging.",
    stack: ["PyTorch", "OpenCV", "YOLO", "TensorFlow", "ONNX", "Python", "CUDA"],
    accent: "rose",
  },
];

const MINOR_SERVICES = [
  {
    icon: Users,
    label: "Social Media Influencer Management",
    desc: "Strategy, scheduling, analytics, brand partnerships, and cross-platform growth for content creators and influencers.",
  },
  {
    icon: Music,
    label: "Artist Management",
    desc: "Digital presence setup, release planning, playlist pitching, booking support, and online brand development for musicians and performers.",
  },
  {
    icon: Headphones,
    label: "Tech Support for Social Platforms",
    desc: "Troubleshooting, account recovery, monetisation setup, and platform optimisation for creators managing complex multi-channel presence.",
  },
];

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Discovery",
    desc: "We align on goals, constraints, timeline, and the data landscape. I ask the right questions upfront so nothing gets rebuilt later.",
  },
  {
    num: "02",
    title: "Architecture",
    desc: "I design the system blueprint — choosing the right stack, infrastructure, and AI models for your specific requirements and scale.",
  },
  {
    num: "03",
    title: "Build",
    desc: "Iterative development with regular checkpoints. You see progress early and often — no big reveal at the end.",
  },
  {
    num: "04",
    title: "Deploy",
    desc: "Production-ready launch with monitoring, error tracking, and documentation so you can operate confidently from day one.",
  },
  {
    num: "05",
    title: "Iterate",
    desc: "Post-launch optimisation, feature additions, and ongoing support. Good software evolves — I stay engaged as your system grows.",
  },
];

const GUARANTEES = [
  "Clean, documented, maintainable code",
  "Regular progress updates and demos",
  "Production deployment included",
  "Post-launch support window",
  "Transparent, hourly billing",
  "Full IP ownership transferred to you",
];

const ACCENT_COLORS: Record<string, string> = {
  sky:    "bg-sky-400",
  indigo: "bg-indigo-400",
  violet: "bg-violet-400",
  emerald:"bg-emerald-400",
  amber:  "bg-amber-400",
  rose:   "bg-rose-400",
};

/* ─── Components ────────────────────────────────────────────────── */

function CoreServiceCard({ svc, index }: { svc: typeof CORE_SERVICES[0]; index: number }) {
  const { icon: Icon, title, tagline, desc, detail, stack, accent } = svc;
  const dotColor = ACCENT_COLORS[accent] ?? "bg-sky-400";

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -5, transition: { type: "spring", stiffness: 280, damping: 22 } }}
      className="group bg-[var(--background)] p-8 lg:p-10 flex flex-col gap-6 relative overflow-hidden cursor-default border-b border-r border-[var(--border)]"
    >
      {/* Left accent bar */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-px bg-[var(--foreground)] origin-top"
        initial={{ scaleY: 0 }}
        whileHover={{ scaleY: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* HUD corners */}
      <span className="absolute top-4 left-4 w-4 h-4 border-t border-l border-transparent group-hover:border-[var(--foreground)]/25 transition-all duration-300" />
      <span className="absolute top-4 right-4 w-4 h-4 border-t border-r border-transparent group-hover:border-[var(--foreground)]/25 transition-all duration-300" />
      <span className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-transparent group-hover:border-[var(--foreground)]/25 transition-all duration-300" />
      <span className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-transparent group-hover:border-[var(--foreground)]/25 transition-all duration-300" />

      {/* Index watermark */}
      <span className="absolute top-5 right-6 text-[11px] font-mono text-[var(--foreground)] opacity-[0.05] group-hover:opacity-[0.2] transition-opacity duration-500 select-none">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 border border-[var(--border)] group-hover:border-[var(--foreground)]/40 flex items-center justify-center flex-shrink-0 transition-all duration-300 relative">
          <Icon size={16} className="text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors duration-300" />
        </div>
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--muted)] mb-1 flex items-center gap-1.5">
            <span className={`w-1 h-1 rounded-full inline-block ${dotColor}`} />
            {tagline}
          </p>
          <h3 className="text-base font-light text-[var(--foreground)] leading-snug">{title}</h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-[var(--muted)] leading-relaxed font-light">{desc}</p>
      <p className="text-xs text-[var(--muted)] leading-relaxed font-light opacity-70">{detail}</p>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-2 pt-2">
        {stack.map(tag => (
          <span
            key={tag}
            className="font-mono text-[9px] tracking-widest uppercase px-2.5 py-1 border border-[var(--border)] text-[var(--muted)] group-hover:border-[var(--foreground)]/20 transition-colors duration-300"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Rate footer */}
      <div className="mt-auto pt-5 border-t border-[var(--border)] flex items-center justify-between">
        <p className="text-[10px] tracking-widest uppercase text-[var(--muted)] group-hover:text-[var(--foreground)]/50 transition-colors">
          From $80 / hr
        </p>
        <motion.div
          className="flex items-center gap-1 text-[10px] tracking-widest uppercase text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors"
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Get a quote <ArrowRight size={10} />
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--background)]">

        {/* ── Page header ── */}
        <section className="pt-32 pb-16 border-b border-[var(--border)] relative overflow-hidden">
          <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[300px] bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.05),transparent_70%)]" />
          <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[200px] bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.04),transparent_70%)]" />

          <div className="max-w-6xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
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
              className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-3 flex items-center gap-2"
            >
              <PulseDot color="bg-sky-400" />
              What I build
            </motion.p>

            <h1 className="text-4xl lg:text-6xl font-light text-[var(--foreground)] leading-none tracking-tight mb-6">
              <SplitWords text="Services &" delay={0.12} />
              <br />
              <span className="opacity-30">
                <SplitWords text="Expertise" delay={0.3} />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="text-sm text-[var(--muted)] font-light max-w-xl leading-relaxed mb-12"
            >
              From AI-powered web applications to computer vision systems — I build intelligent digital products that solve real problems and scale with your ambitions.
            </motion.p>

            {/* Rate banner */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="inline-flex items-center gap-6 border border-[var(--border)] px-6 py-4 relative"
            >
              <motion.div
                className="absolute inset-0 border border-[var(--foreground)]/10"
                animate={{ opacity: [0.3, 0.9, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--muted)] mb-0.5 flex items-center gap-1.5">
                  <PulseDot color="bg-emerald-400" />
                  Available now
                </p>
                <p className="text-[10px] tracking-widest uppercase text-[var(--muted)]">Starting rate</p>
              </div>
              <div className="w-px h-8 bg-[var(--border)]" />
              <div>
                <span className="text-3xl font-light text-[var(--foreground)]">$80</span>
                <span className="text-xs text-[var(--muted)] ml-2">/ hour</span>
              </div>
            </motion.div>

            <DrawLine delay={0.9} className="mt-12" />
          </div>
        </section>

        {/* ── Core services ── */}
        <section className="py-20 border-b border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-6">

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-3 flex items-center gap-2">
                <PulseDot color="bg-sky-400" />
                Core services
              </p>
              <h2 className="text-2xl lg:text-3xl font-light text-[var(--foreground)]">
                What I specialise in
              </h2>
            </motion.div>

            {/* Animated left border */}
            <motion.div
              className="h-px bg-[var(--border)] origin-left mb-0"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            />

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-t border-[var(--border)]"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.05 }}
            >
              {CORE_SERVICES.map((svc, i) => (
                <CoreServiceCard key={svc.title} svc={svc} index={i} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Additional services ── */}
        <section className="py-20 border-b border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-6">

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4 mb-10"
            >
              <span className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] flex items-center gap-2">
                <PulseDot color="bg-[var(--muted)]" />
                Additional services
              </span>
              <motion.div
                className="flex-1 h-px bg-[var(--border)] origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border)]"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {MINOR_SERVICES.map(({ icon: Icon, label, desc }) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  whileHover={{ y: -4, transition: { type: "spring", stiffness: 280 } }}
                  className="group bg-[var(--background)] p-8 flex flex-col gap-4 relative overflow-hidden cursor-default"
                >
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-px bg-[var(--foreground)] origin-top"
                    initial={{ scaleY: 0 }}
                    whileHover={{ scaleY: 1 }}
                    transition={{ duration: 0.25 }}
                  />
                  <div className="w-9 h-9 border border-[var(--border)] group-hover:border-[var(--foreground)]/40 flex items-center justify-center flex-shrink-0 transition-all duration-300">
                    <Icon size={14} className="text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-sm font-light text-[var(--foreground)] mb-2 leading-snug">{label}</p>
                    <p className="text-xs text-[var(--muted)] leading-relaxed font-light">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Process ── */}
        <section className="py-20 border-b border-[var(--border)] relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.03),transparent_60%)]" />
          <div className="max-w-6xl mx-auto px-6">

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-14"
            >
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-3 flex items-center gap-2">
                <PulseDot color="bg-violet-400" />
                How it works
              </p>
              <h2 className="text-2xl lg:text-3xl font-light text-[var(--foreground)]">
                My process<br />
                <span className="opacity-30">from brief to shipped</span>
              </h2>
            </motion.div>

            <DrawLine delay={0.1} className="mb-12" />

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-[var(--border)]"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
            >
              {PROCESS_STEPS.map(({ num, title, desc }) => (
                <motion.div
                  key={num}
                  variants={fadeUp}
                  whileHover={{ y: -4, transition: { type: "spring", stiffness: 280 } }}
                  className="group bg-[var(--background)] p-7 flex flex-col gap-4 relative overflow-hidden cursor-default"
                >
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-px bg-[var(--foreground)] origin-top"
                    initial={{ scaleY: 0 }}
                    whileHover={{ scaleY: 1 }}
                    transition={{ duration: 0.25 }}
                  />

                  <span className="font-mono text-2xl font-light text-[var(--foreground)] opacity-[0.08] group-hover:opacity-20 transition-opacity duration-300 select-none">
                    {num}
                  </span>
                  <div>
                    <p className="text-sm font-light text-[var(--foreground)] mb-2">{title}</p>
                    <p className="text-xs text-[var(--muted)] leading-relaxed font-light">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Guarantees ── */}
        <section className="py-20 border-b border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-6">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-3 flex items-center gap-2">
                  <PulseDot color="bg-emerald-400" />
                  My commitment
                </p>
                <h2 className="text-2xl lg:text-3xl font-light text-[var(--foreground)] leading-tight mb-6">
                  What you get<br />
                  <span className="opacity-30">on every engagement</span>
                </h2>
                <p className="text-sm text-[var(--muted)] font-light leading-relaxed">
                  Every project is treated as a partnership. I bring full technical capability, clear communication, and a genuine interest in your outcome — not just deliverables on a checklist.
                </p>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
              >
                {GUARANTEES.map((g, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="group flex items-center gap-3 p-4 border border-[var(--border)] bg-[var(--background)] hover:border-[var(--foreground)]/30 transition-colors duration-300"
                    whileHover={{ x: 3, transition: { type: "spring", stiffness: 300 } }}
                  >
                    <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                    <p className="text-xs font-light text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors duration-300 leading-snug">
                      {g}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.04),transparent_60%)]" />

          <div className="max-w-3xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 0.07, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-8xl font-light text-[var(--foreground)] mb-4 leading-none select-none"
              aria-hidden="true"
            >
              →
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-5 flex items-center justify-center gap-2"
            >
              <PulseDot color="bg-emerald-400" />
              Ready to start?
            </motion.p>

            <h2 className="text-3xl lg:text-4xl font-light text-[var(--foreground)] leading-tight mb-6">
              <SplitWords text="Let's build something" useInView delay={0.1} />
              <br />
              <span className="opacity-30">
                <SplitWords text="exceptional together" useInView delay={0.35} />
              </span>
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-sm text-[var(--muted)] font-light max-w-md mx-auto leading-relaxed mb-10"
            >
              Describe your project and I'll get back to you within 24 hours with an honest assessment of scope, timeline, and cost.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.75 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.a
                href="https://wa.me/12272492922?text=Hi%20Nigel%2C%20I%20would%20like%20to%20discuss%20a%20project%20with%20you!"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 bg-[var(--foreground)] text-[var(--background)] text-xs tracking-widest uppercase relative overflow-hidden group"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.span
                  className="absolute inset-0 bg-white/10 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative">Get a quote on WhatsApp</span>
              </motion.a>

              <motion.a
                href="mailto:hello@amonigel.com"
                className="px-8 py-3.5 border border-[var(--border)] text-[var(--foreground)] text-xs tracking-widest uppercase hover:border-[var(--foreground)] transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Send an email
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
