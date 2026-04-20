"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

interface Corporate {
  name: string;
  logo: string | null;
  logoFile: string;
  sector: string;
}

const CORPORATES: Corporate[] = [
  { name: "Quest Financial Services",    logoFile: "logo-quest-financial.png", logo: null, sector: "Financial Services" },
  { name: "FBC Bank Limited",            logoFile: "logo-fbc-bank.png",        logo: null, sector: "Banking" },
  { name: "Government of Zimbabwe",      logoFile: "logo-gov-zimbabwe.png",    logo: null, sector: "Public Sector" },
  { name: "Softrite Payroll Systems",    logoFile: "logo-softrite.png",        logo: null, sector: "HR & Payroll Tech" },
  { name: "Nzira Travel Zimbabwe",       logoFile: "logo-nzira-travel.png",    logo: null, sector: "Travel & Tourism" },
  { name: "Tenga 4 Wena",               logoFile: "logo-tenga4wena.png",      logo: null, sector: "Digital Services" },
  { name: "Mahindra Zimbabwe",           logoFile: "logo-mahindra.png",        logo: null, sector: "Automotive" },
  { name: "Rotary Club of Zimbabwe",     logoFile: "logo-rotary-zimbabwe.png", logo: null, sector: "Non-Profit" },
  { name: "African Sun",                 logoFile: "logo-african-sun.png",     logo: null, sector: "Hospitality" },
  { name: "Royal Harare Golf Club",      logoFile: "logo-royal-harare-gc.png", logo: null, sector: "Sports & Recreation" },
  { name: "Time Detective South Africa", logoFile: "logo-time-detective.png",  logo: null, sector: "Investigations" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.45 } },
};

function LogoPlaceholder({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(w => w.length > 2)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join("");

  return (
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-lg font-light tracking-widest text-[var(--muted)]">{initials}</span>
    </div>
  );
}

function LogoCard({ corp }: { corp: Corporate }) {
  const [imgError, setImgError] = useState(false);
  const src = `/${corp.logoFile}`;

  return (
    <motion.div
      variants={item}
      whileHover={{ y: -4, transition: { type: "spring", stiffness: 300 } }}
      className="group bg-[var(--background)] p-6 flex flex-col items-center gap-4 border-r border-b border-[var(--border)] relative overflow-hidden cursor-default"
    >
      {/* Hover accent */}
      <motion.div
        className="absolute inset-x-0 top-0 h-px bg-[var(--foreground)] origin-left"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Logo area */}
      <div className="w-28 h-16 relative flex items-center justify-center grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
        {!imgError ? (
          <Image
            src={src}
            alt={corp.name}
            fill
            className="object-contain"
            sizes="80px"
            onError={() => setImgError(true)}
          />
        ) : (
          <LogoPlaceholder name={corp.name} />
        )}
      </div>

      {/* Name */}
      <div className="text-center">
        <p className="text-[11px] font-light text-[var(--foreground)] leading-snug group-hover:opacity-100 opacity-70 transition-opacity">
          {corp.name}
        </p>
        <p className="text-[9px] tracking-[0.2em] uppercase text-[var(--muted)] mt-1">
          {corp.sector}
        </p>
      </div>
    </motion.div>
  );
}

export default function CorporatesSection() {
  return (
    <section className="py-24 border-b border-[var(--border)] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.04),transparent_70%)]" />

      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-3 flex items-center gap-2">
            <motion.span
              className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400"
              animate={{ opacity: [1, 0.2, 1], scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Consulting & Advisory
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="text-3xl lg:text-5xl font-light text-[var(--foreground)] leading-tight">
              Corporate<br />
              <span className="opacity-30">Clients & Partners</span>
            </h2>
            <p className="text-sm text-[var(--muted)] font-light max-w-xs sm:text-right leading-relaxed">
              Organisations I have consulted for and delivered digital solutions across multiple industries.
            </p>
          </div>
        </motion.div>

        {/* Divider line */}
        <motion.div
          className="h-px bg-[var(--border)] origin-left mb-0"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />

        {/* Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 border-l border-t border-[var(--border)]"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {CORPORATES.map(corp => (
            <LogoCard key={corp.name} corp={corp} />
          ))}

          {/* "And more" placeholder cell */}
          <motion.div
            variants={item}
            className="bg-[var(--background)] p-6 flex flex-col items-center justify-center gap-2 border-r border-b border-[var(--border)] opacity-40"
          >
            <span className="text-2xl font-extralight text-[var(--foreground)]">+</span>
            <p className="text-[9px] tracking-[0.25em] uppercase text-[var(--muted)] text-center">And more</p>
          </motion.div>
        </motion.div>


      </div>
    </section>
  );
}
