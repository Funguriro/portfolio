"use client";

import { motion, Variants } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Mail, MapPin, Clock,
  Send, Calendar, ExternalLink, GitFork,
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";
import profileData from "@/data/profile.json";

/* ─── Helpers ──────────────────────────────────────────────────── */

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

/* ─── Contact method card ───────────────────────────────────────── */

function ContactCard({
  icon: Icon, label, value, sub, href, accentColor, delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  href: string;
  accentColor: string;
  delay?: number;
}) {
  return (
    <motion.a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay }}
      whileHover={{ y: -4, transition: { type: "spring", stiffness: 280, damping: 22 } }}
      className="group flex flex-col gap-5 p-7 border border-[var(--border)] bg-[var(--background)] hover:border-[var(--foreground)]/30 transition-colors duration-300 relative overflow-hidden cursor-pointer"
    >
      {/* Top accent line */}
      <motion.div
        className="absolute inset-x-0 top-0 h-px bg-[var(--foreground)] origin-left"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.35 }}
      />

      {/* HUD corners */}
      <span className="absolute top-3 left-3 w-3 h-3 border-t border-l border-transparent group-hover:border-[var(--foreground)]/20 transition-all duration-300" />
      <span className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-transparent group-hover:border-[var(--foreground)]/20 transition-all duration-300" />

      {/* Icon */}
      <div className={`w-10 h-10 border border-[var(--border)] group-hover:border-[var(--foreground)]/40 flex items-center justify-center flex-shrink-0 transition-all duration-300 relative`}>
        <Icon size={15} className="text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors duration-300" />
        <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${accentColor} opacity-70`} />
      </div>

      <div className="flex-1">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--muted)] mb-1">{label}</p>
        <p className="text-sm font-light text-[var(--foreground)] leading-snug mb-1">{value}</p>
        {sub && <p className="text-[10px] text-[var(--muted)] leading-relaxed">{sub}</p>}
      </div>

      <div className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors duration-300">
        <span>Open</span>
        <ExternalLink size={9} />
      </div>
    </motion.a>
  );
}

/* ─── Form ──────────────────────────────────────────────────────── */

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [focused, setFocused] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    window.location.href = `mailto:${profileData.contact.email}?subject=${encodeURIComponent(form.subject || "Message from portfolio")}&body=${encodeURIComponent(body)}`;
  };

  const fields = [
    { key: "name",    label: "Your Name",    type: "text",  placeholder: "John Smith"              },
    { key: "email",   label: "Email Address", type: "email", placeholder: "you@example.com"         },
    { key: "subject", label: "Subject",       type: "text",  placeholder: "Project inquiry, etc."   },
  ] as const;

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="flex flex-col gap-5"
    >
      {fields.map(({ key, label, type, placeholder }) => (
        <div key={key} className="relative">
          <motion.label
            className="block text-[10px] tracking-[0.25em] uppercase mb-2 transition-colors duration-200"
            style={{ color: focused === key ? "var(--foreground)" : "var(--muted)" }}
          >
            {label}
          </motion.label>
          <div className="relative">
            <input
              type={type}
              value={form[key]}
              onChange={set(key)}
              onFocus={() => setFocused(key)}
              onBlur={() => setFocused(null)}
              placeholder={placeholder}
              className="w-full bg-transparent border border-[var(--border)] px-4 py-3 text-sm font-light text-[var(--foreground)] placeholder:text-[var(--muted)]/40 outline-none transition-colors duration-200 focus:border-[var(--foreground)]/50"
            />
            {/* Animated bottom line on focus */}
            <motion.div
              className="absolute bottom-0 left-0 h-px bg-[var(--foreground)] origin-left"
              animate={{ scaleX: focused === key ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      ))}

      {/* Message */}
      <div className="relative">
        <motion.label
          className="block text-[10px] tracking-[0.25em] uppercase mb-2 transition-colors duration-200"
          style={{ color: focused === "message" ? "var(--foreground)" : "var(--muted)" }}
        >
          Message
        </motion.label>
        <div className="relative">
          <textarea
            rows={5}
            value={form.message}
            onChange={set("message")}
            onFocus={() => setFocused("message")}
            onBlur={() => setFocused(null)}
            placeholder="Tell me about your project, timeline, or anything else..."
            className="w-full bg-transparent border border-[var(--border)] px-4 py-3 text-sm font-light text-[var(--foreground)] placeholder:text-[var(--muted)]/40 outline-none transition-colors duration-200 focus:border-[var(--foreground)]/50 resize-none"
          />
          <motion.div
            className="absolute bottom-0 left-0 h-px bg-[var(--foreground)] origin-left"
            animate={{ scaleX: focused === "message" ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="group flex items-center justify-center gap-3 px-8 py-3.5 bg-[var(--foreground)] text-[var(--background)] text-xs tracking-widest uppercase relative overflow-hidden mt-2"
      >
        <motion.span
          className="absolute inset-0 bg-white/10 origin-left"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
        <span className="relative flex items-center gap-2">
          Send message
          <motion.span
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Send size={12} />
          </motion.span>
        </span>
      </motion.button>

    </motion.form>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */

export default function ContactPage() {
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
              <PulseDot color="bg-emerald-400" />
              Get in touch
            </motion.p>

            <h1 className="text-4xl lg:text-6xl font-light text-[var(--foreground)] leading-none tracking-tight mb-6">
              <SplitWords text="Let's talk" delay={0.12} />
              <br />
              <span className="opacity-30">
                <SplitWords text="about your project" delay={0.3} />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="text-sm text-[var(--muted)] font-light max-w-xl leading-relaxed mb-10"
            >
              Whether you have a project idea, a question about my research, or just want to connect — I'm always open to a good conversation. Reach out through any channel below.
            </motion.p>

            {/* Availability status bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="inline-flex items-center gap-5 border border-[var(--border)] px-5 py-3 relative"
            >
              <motion.div
                className="absolute inset-0 border border-[var(--foreground)]/8"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <span className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[var(--muted)]">
                <PulseDot color="bg-emerald-400" />
                Available for new projects
              </span>
              <span className="w-px h-4 bg-[var(--border)]" />
              <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--muted)]">Response within 24h</span>
              <span className="w-px h-4 bg-[var(--border)]" />
              <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--muted)]">EST · UTC−5</span>
            </motion.div>

            <DrawLine delay={0.85} className="mt-12" />
          </div>
        </section>

        {/* ── Contact methods ── */}
        <section className="py-20 border-b border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-2 flex items-center gap-2">
                <PulseDot color="bg-sky-400" />
                Preferred channels
              </p>
              <h2 className="text-2xl lg:text-3xl font-light text-[var(--foreground)]">
                Choose how to reach me
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ContactCard
                icon={() => (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                )}
                label="WhatsApp"
                value={`+1 (227) 249-2922`}
                sub="Fastest response — usually within a few hours"
                href={`https://wa.me/${profileData.contact.whatsapp}?text=Hi%20Nigel%2C%20I%20found%20you%20on%20your%20portfolio%20and%20would%20love%20to%20connect!`}
                accentColor="bg-emerald-400"
                delay={0}
              />
              <ContactCard
                icon={Mail}
                label="Email"
                value={profileData.contact.email}
                sub="For detailed briefs, proposals, or formal enquiries"
                href={`mailto:${profileData.contact.email}`}
                accentColor="bg-sky-400"
                delay={0.1}
              />
              <ContactCard
                icon={Calendar}
                label="Book a call"
                value="Calendly"
                sub="Schedule a 30-min discovery call at a time that works for you"
                href={profileData.contact.calendly}
                accentColor="bg-violet-400"
                delay={0.2}
              />
              <ContactCard
                icon={() => (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                )}
                label="LinkedIn"
                value="Amos Nigel Funguriro"
                sub="Connect professionally or send a message on LinkedIn"
                href={profileData.social.linkedin}
                accentColor="bg-indigo-400"
                delay={0.3}
              />
            </div>
          </div>
        </section>

        {/* ── Form + Location ── */}
        <section className="py-20 border-b border-[var(--border)] relative overflow-hidden">
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.03),transparent_60%)]" />

          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

              {/* Left: Form */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="mb-10"
                >
                  <p className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-3 flex items-center gap-2">
                    <PulseDot color="bg-sky-400" />
                    Send a message
                  </p>
                  <h2 className="text-2xl lg:text-3xl font-light text-[var(--foreground)] leading-tight">
                    Tell me about your project<br />
                    <span className="opacity-30">I'll get back to you within 24h</span>
                  </h2>
                </motion.div>

                <ContactForm />
              </div>

              {/* Right: Info blocks */}
              <div className="flex flex-col gap-6">

                {/* Location card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="group border border-[var(--border)] p-7 relative overflow-hidden hover:border-[var(--foreground)]/30 transition-colors duration-300"
                >
                  <motion.div
                    className="absolute inset-x-0 top-0 h-px bg-[var(--foreground)] origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                  <span className="absolute top-3 left-3 w-3 h-3 border-t border-l border-transparent group-hover:border-[var(--foreground)]/20 transition-all duration-300" />
                  <span className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-transparent group-hover:border-[var(--foreground)]/20 transition-all duration-300" />

                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-9 h-9 border border-[var(--border)] flex items-center justify-center flex-shrink-0">
                      <MapPin size={14} className="text-[var(--muted)]" />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--muted)] mb-1 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 inline-block" />
                        Current location
                      </p>
                      <p className="text-sm font-light text-[var(--foreground)]">Washington, DC</p>
                    </div>
                  </div>

                  {/* Address block */}
                  <div className="pl-13 ml-13">
                    <div className="border-l border-[var(--border)] pl-5 ml-1 flex flex-col gap-1.5">
                      <p className="text-xs font-light text-[var(--foreground)]">620 Michigan Ave., N.E.</p>
                      <p className="text-xs font-light text-[var(--foreground)]">Washington, DC 20064</p>
                      <p className="text-xs text-[var(--muted)]">United States of America</p>
                    </div>
                  </div>

                  {/* Decorative coordinate line */}
                  <div className="mt-5 pt-5 border-t border-[var(--border)] flex items-center justify-between">
                    <span className="font-mono text-[9px] tracking-widest text-[var(--muted)] opacity-60">38.9372° N, 76.9985° W</span>
                    <span className="font-mono text-[9px] tracking-widest text-[var(--muted)] opacity-60">EST · UTC−5</span>
                  </div>
                </motion.div>

                {/* Availability card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="group border border-[var(--border)] p-7 relative overflow-hidden hover:border-[var(--foreground)]/30 transition-colors duration-300"
                >
                  <motion.div
                    className="absolute inset-x-0 top-0 h-px bg-[var(--foreground)] origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.4 }}
                  />

                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-9 h-9 border border-[var(--border)] flex items-center justify-center flex-shrink-0">
                      <Clock size={14} className="text-[var(--muted)]" />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--muted)] mb-1">Availability</p>
                      <p className="text-sm font-light text-[var(--foreground)]">Open to new engagements</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {[
                      { label: "Response time",  value: "Within 24 hours",     dot: "bg-emerald-400" },
                      { label: "Working hours",  value: "Mon–Fri, 9am–6pm EST", dot: "bg-sky-400"    },
                      { label: "Availability",   value: "Remote & On-site (DC)", dot: "bg-violet-400" },
                      { label: "Project length", value: "1 week to 6+ months",  dot: "bg-amber-400"  },
                    ].map(({ label, value, dot }) => (
                      <div key={label} className="flex items-center justify-between py-2.5 border-b border-[var(--border)] last:border-b-0">
                        <span className="text-[10px] tracking-widest uppercase text-[var(--muted)] flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${dot} inline-block opacity-70`} />
                          {label}
                        </span>
                        <span className="text-xs font-light text-[var(--foreground)]">{value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Social links */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="border border-[var(--border)] p-7"
                >
                  <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--muted)] mb-5">Find me on</p>
                  <div className="flex flex-wrap gap-3">
                    {[
                      {
                        label: "LinkedIn",
                        href: profileData.social.linkedin,
                        icon: (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        ),
                      },
                      {
                        label: "GitHub",
                        href: `https://github.com/${profileData.social.github}`,
                        icon: <GitFork size={13} />,
                      },
                      {
                        label: "Instagram",
                        href: "https://www.instagram.com/nigel_amo",
                        icon: (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                          </svg>
                        ),
                      },
                    ].map(({ label, href, icon }) => (
                      <motion.a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -2, transition: { type: "spring", stiffness: 300 } }}
                        className="group flex items-center gap-2 px-4 py-2.5 border border-[var(--border)] hover:border-[var(--foreground)] text-[var(--muted)] hover:text-[var(--foreground)] transition-all duration-300"
                      >
                        {icon}
                        <span className="text-[10px] tracking-widest uppercase">{label}</span>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>

              </div>
            </div>
          </div>
        </section>

        {/* ── Closing CTA ── */}
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
            >
              ✦
            </motion.div>

            <p className="text-2xl lg:text-3xl font-light text-[var(--foreground)] leading-tight mb-4">
              <SplitWords text="Good things start" useInView delay={0.1} />
              <br />
              <span className="opacity-30">
                <SplitWords text="with a conversation." useInView delay={0.35} />
              </span>
            </p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-sm text-[var(--muted)] font-light max-w-sm mx-auto leading-relaxed mb-10"
            >
              No pressure, no pitch. Just an honest conversation about what you're building and whether I can help.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.75 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.a
                href={`https://wa.me/${profileData.contact.whatsapp}?text=Hi%20Nigel%2C%20I%20found%20you%20on%20your%20portfolio%20and%20would%20love%20to%20connect!`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 bg-[var(--foreground)] text-[var(--background)] text-xs tracking-widest uppercase relative overflow-hidden group"
              >
                <motion.span className="absolute inset-0 bg-white/10 origin-left" initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.3 }} />
                <span className="relative">Message on WhatsApp</span>
              </motion.a>
              <motion.a
                href={profileData.contact.calendly}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 border border-[var(--border)] text-[var(--foreground)] text-xs tracking-widest uppercase hover:border-[var(--foreground)] transition-colors"
              >
                Book a call
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
