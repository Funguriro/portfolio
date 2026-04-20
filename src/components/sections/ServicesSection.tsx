"use client";

import { motion } from "framer-motion";
import {
  Globe, Smartphone, Workflow, Bot,
  BarChart3, Eye, Users, Music, Headphones,
} from "lucide-react";

const CORE_SERVICES = [
  {
    icon: Globe,
    title: "Modern AI Website Development",
    desc: "Full-stack websites powered by AI — RAG search, chatbots, smart personalization, and clean design that converts.",
  },
  {
    icon: Smartphone,
    title: "App Development",
    desc: "Cross-platform mobile and web apps built with React Native, Next.js, and cloud-native backends.",
  },
  {
    icon: Workflow,
    title: "AI Automation & Pipeline Engineering",
    desc: "End-to-end ML pipelines, data ingestion workflows, and intelligent automation that eliminates manual processes.",
  },
  {
    icon: Bot,
    title: "AI Agents",
    desc: "Autonomous AI agents that reason, plan, and execute — customer service, research, and operations automation.",
  },
  {
    icon: BarChart3,
    title: "Data Analytics & Visualization",
    desc: "Transform raw data into clear business intelligence. Interactive dashboards, reporting pipelines, and predictive models.",
  },
  {
    icon: Eye,
    title: "Computer Vision Solutions",
    desc: "Real-time image recognition, object detection, and video analysis systems built with PyTorch and OpenCV.",
  },
];

const MINOR_SERVICES = [
  {
    icon: Users,
    label: "Social Media Influencer Management",
    desc:  "Full-service management of creator brands — strategy, scheduling, growth, monetisation, and cross-platform audience development.",
  },
  {
    icon: Music,
    label: "Artist Management",
    desc:  "Digital presence, release planning, playlist pitching, and online brand building for musicians and performing artists.",
  },
  {
    icon: Headphones,
    label: "Tech Support for Social Platforms",
    desc:  "Account setup, troubleshooting, security, monetisation activation, and platform optimisation for multi-channel creators.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const item = {
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.55 } },
};

const minorContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

function ServiceCard({ icon: Icon, title, desc, index }: {
  icon: React.ElementType; title: string; desc: string; index: number;
}) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -5, transition: { type: "spring", stiffness: 280, damping: 22 } }}
      className="group bg-[var(--background)] p-8 flex flex-col gap-5 relative overflow-hidden cursor-default"
    >
      {/* Left accent bar */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-px bg-[var(--foreground)] origin-top"
        initial={{ scaleY: 0 }}
        whileHover={{ scaleY: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {/* HUD corner brackets */}
      <span className="absolute top-3 left-3 w-4 h-4 border-t border-l border-transparent group-hover:border-[var(--foreground)]/30 transition-all duration-400" />
      <span className="absolute top-3 right-3 w-4 h-4 border-t border-r border-transparent group-hover:border-[var(--foreground)]/30 transition-all duration-400" />
      <span className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-transparent group-hover:border-[var(--foreground)]/30 transition-all duration-400" />
      <span className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-transparent group-hover:border-[var(--foreground)]/30 transition-all duration-400" />

      {/* Index number watermark */}
      <span className="absolute top-5 right-6 text-[11px] font-mono text-[var(--foreground)] opacity-[0.05] group-hover:opacity-[0.18] transition-opacity duration-500 select-none">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Icon container */}
      <div className="w-10 h-10 border border-[var(--border)] group-hover:border-[var(--foreground)]/40 flex items-center justify-center flex-shrink-0 relative transition-all duration-300">
        <Icon size={15} className="text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors duration-300" />
        {/* Subtle glow on hover */}
        <motion.span
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          style={{ boxShadow: "inset 0 0 12px rgba(56,189,248,0.08)" }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div>
        <p className="text-sm font-light text-[var(--foreground)] mb-2 leading-snug">{title}</p>
        <p className="text-xs text-[var(--muted)] leading-relaxed font-light">{desc}</p>
      </div>

      <p className="text-[10px] tracking-widest uppercase text-[var(--muted)] mt-auto pt-4 border-t border-[var(--border)] group-hover:text-[var(--foreground)]/50 transition-colors duration-300">
        From $80 / hr
      </p>

      {/* Bottom scan line on hover */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--foreground)]/20 to-transparent opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
}

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 border-b border-[var(--border)] relative overflow-hidden">

      {/* Ambient corner glow */}
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.04),transparent_70%)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.04),transparent_70%)]" />

      <div className="max-w-6xl mx-auto px-6">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-3 flex items-center gap-2">
              <motion.span
                className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400"
                animate={{ opacity: [1, 0.2, 1], scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              What I build
            </p>
            <h2 className="text-3xl lg:text-5xl font-light text-[var(--foreground)] leading-tight">
              Services &<br />
              <span className="opacity-30">Expertise</span>
            </h2>
          </motion.div>

          {/* Rate badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0 relative"
          >
            {/* Pulsing border ring */}
            <motion.div
              className="absolute inset-0 border border-[var(--foreground)]/10"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <div className="border border-[var(--border)] px-6 py-4 text-right relative">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--muted)] mb-1 flex items-center justify-end gap-1.5">
                <motion.span
                  className="w-1 h-1 rounded-full bg-emerald-400 inline-block"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
                Starting rate
              </p>
              <motion.p
                className="text-3xl font-light text-[var(--foreground)] leading-none"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                $80
              </motion.p>
              <p className="text-xs text-[var(--muted)] mt-1">per hour</p>
            </div>
          </motion.div>
        </div>

        {/* Animated divider line */}
        <motion.div
          className="h-px bg-[var(--border)] origin-left mb-0"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Core services grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border)] mb-px"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {CORE_SERVICES.map(({ icon, title, desc }, i) => (
            <ServiceCard key={title} icon={icon} title={title} desc={desc} index={i} />
          ))}
        </motion.div>

        {/* Additional services label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14 mb-6"
        >
          <div className="flex items-center gap-4 mb-3">
            <span className="text-xs tracking-[0.3em] uppercase text-[var(--foreground)] flex items-center gap-2 font-light">
              <motion.span
                className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400"
                animate={{ opacity: [1, 0.2, 1], scale: [1, 1.5, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              Additional services
            </span>
            <motion.div
              className="flex-1 h-px bg-[var(--border)] origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
          <p className="text-[11px] text-[var(--muted)] font-light">Beyond software — creative and platform services for the creator economy.</p>
        </motion.div>

        {/* Minor services */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[var(--border)]"
          variants={minorContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {MINOR_SERVICES.map(({ icon: Icon, label, desc }) => (
            <motion.div
              key={label}
              variants={item}
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 300 } }}
              className="group bg-[var(--background)] p-7 flex flex-col gap-4 cursor-default relative overflow-hidden"
            >
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-px bg-[var(--foreground)] origin-top"
                initial={{ scaleY: 0 }}
                whileHover={{ scaleY: 1 }}
                transition={{ duration: 0.25 }}
              />
              <motion.div
                className="absolute inset-x-0 top-0 h-px bg-amber-400/40 origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.35 }}
              />
              <span className="absolute top-3 right-4 w-3 h-3 border-t border-r border-transparent group-hover:border-[var(--foreground)]/20 transition-all duration-300" />
              <span className="absolute bottom-3 left-4 w-3 h-3 border-b border-l border-transparent group-hover:border-[var(--foreground)]/20 transition-all duration-300" />

              <div className="w-10 h-10 border border-[var(--border)] group-hover:border-[var(--foreground)]/40 flex items-center justify-center flex-shrink-0 transition-all duration-300">
                <Icon size={15} className="text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors duration-300" />
              </div>
              <div>
                <p className="text-sm font-light text-[var(--foreground)] leading-snug mb-2">{label}</p>
                <p className="text-xs text-[var(--muted)] leading-relaxed font-light">{desc}</p>
              </div>
              <p className="text-[10px] tracking-widest uppercase text-[var(--muted)] mt-auto pt-4 border-t border-[var(--border)] group-hover:text-[var(--foreground)]/50 transition-colors">
                From $50 / hr
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-10 border-t border-[var(--border)]"
        >
          <p className="text-sm text-[var(--muted)] font-light max-w-md">
            Have a project in mind? Let's discuss scope, timeline, and how I can help you ship something exceptional.
          </p>
          <div className="flex items-center gap-4 flex-shrink-0">
            <motion.a
              href="https://wa.me/12272492922?text=Hi%20Nigel%2C%20I%20would%20like%20to%20discuss%20a%20project%20with%20you!"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3 bg-[var(--foreground)] text-[var(--background)] text-xs tracking-widest uppercase relative overflow-hidden group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.span
                className="absolute inset-0 bg-white/10 origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative">Get a quote</span>
            </motion.a>
            <motion.a
              href="/#contact"
              className="px-7 py-3 border border-[var(--border)] text-[var(--foreground)] text-xs tracking-widest uppercase hover:border-[var(--foreground)] transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Contact
            </motion.a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
