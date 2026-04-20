"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Influencer {
  name: string;
  title: string;
  origin: string;
  photo: string | null;
  platforms: Array<"instagram" | "youtube" | "facebook" | "twitter">;
  description: string;
}

const INFLUENCERS: Influencer[] = [
  {
    name:        "Comic Elder",
    title:       "Comedian & Content Creator",
    origin:      "Zimbabwe",
    photo:       "/influencer-comic-elder.jpg",
    platforms:   ["instagram", "youtube", "facebook"],
    description: "Managed Comic Elder's social media presence, handling client relations, and platform optimization across multiple channels.",
  },
  {
    name:        "Gamu",
    title:       "Content Creator & Brand",
    origin:      "Zimbabwe",
    photo:       "/influencer-gamu.jpg",
    platforms:   ["facebook", "youtube"],
    description: "Handled full overall brand management for Gamu — overseeing strategy, content direction, audience growth, and platform operations across Facebook and YouTube.",
  },
  {
    name:        "Frets Donzvo",
    title:       "Content Creator",
    origin:      "Zimbabwe",
    photo:       "/influencer-frets-donzvo.jpg",
    platforms:   ["facebook"],
    description: "Managed Frets Donzvo's Facebook platform with a focused strategy on monetisation — unlocking and scaling revenue streams through content optimisation and audience engagement.",
  },
  {
    name:        "Mbuya Va Piyasoni",
    title:       "Content Creator",
    origin:      "Zimbabwe",
    photo:       "/influencer-mbuya-va-piyasoni.jpg",
    platforms:   ["facebook"],
    description: "Overseeing platform management for Mbuya Va Piyasoni with a dual focus on account security and monetisation — protecting the brand while building sustainable revenue from content.",
  },
  {
    name:        "Stunt Master Flex",
    title:       "Content Creator",
    origin:      "Zimbabwe",
    photo:       "/influencer-stunt-master-flex.jpg",
    platforms:   ["facebook"],
    description: "Managing Stunt Master Flex's Facebook presence with emphasis on platform security and monetisation strategy — ensuring a protected, revenue-generating digital brand.",
  },
  {
    name:        "Rutendo",
    title:       "Content Creator",
    origin:      "Zimbabwe",
    photo:       "/influencer-rutendo.jpg",
    platforms:   ["facebook"],
    description: "Handling platform management for Rutendo, focused on securing the account and activating monetisation features to turn an engaged audience into consistent income.",
  },
  {
    name:        "Sarah Takawira",
    title:       "Content Creator",
    origin:      "Zimbabwe",
    photo:       "/influencer-sarah-takawira.jpg",
    platforms:   ["facebook"],
    description: "Managing Sarah Takawira's Facebook platform with a focus on account security and monetisation — growing and protecting her digital footprint while maximising revenue potential.",
  },
  {
    name:        "Stimy Stimela",
    title:       "Content Creator",
    origin:      "Zimbabwe",
    photo:       "/influencer-stimy-stimela.jpg",
    platforms:   ["facebook"],
    description: "Overseeing platform management for Stimy Stimela, with strategic focus on monetisation enablement and keeping the account secure and compliant with platform policies.",
  },
  {
    name:        "Tunga",
    title:       "Content Creator",
    origin:      "Zimbabwe",
    photo:       "/influencer-tunga.jpg",
    platforms:   ["facebook"],
    description: "Managing Tunga's Facebook platform with attention to security best practices and monetisation setup — building a stable, income-generating presence for a growing creator.",
  },
];

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  instagram: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  ),
  youtube: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  facebook: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  ),
  twitter: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
};

export default function InfluencersSlider() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex(i => (i - 1 + INFLUENCERS.length) % INFLUENCERS.length);
  }, []);

  const next = useCallback(() => {
    setDirection(1);
    setIndex(i => (i + 1) % INFLUENCERS.length);
  }, []);

  // Auto-advance only when there are multiple
  useEffect(() => {
    if (INFLUENCERS.length < 2) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  const current = INFLUENCERS[index];

  const variants = {
    enter:   (d: number) => ({ opacity: 0, x: d * 60, filter: "blur(6px)" }),
    center:  { opacity: 1, x: 0,       filter: "blur(0px)" },
    exit:    (d: number) => ({ opacity: 0, x: d * -60, filter: "blur(6px)" }),
  };

  return (
    <section className="py-24 border-b border-[var(--border)] relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-64 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.04),transparent_70%)]" />
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14"
        >
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-3 flex items-center gap-2">
              <motion.span
                className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400"
                animate={{ opacity: [1, 0.2, 1], scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Clientele
            </p>
            <h2 className="text-3xl lg:text-4xl font-light text-[var(--foreground)] leading-tight">
              Artists & Influencers<br />
              <span className="opacity-30">I've worked with</span>
            </h2>
          </div>

          {/* Nav arrows */}
          {INFLUENCERS.length > 1 && (
            <div className="flex items-center gap-3">
              <motion.button
                onClick={prev}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)] transition-all"
                aria-label="Previous"
              >
                <ChevronLeft size={16} />
              </motion.button>
              <motion.button
                onClick={next}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)] transition-all"
                aria-label="Next"
              >
                <ChevronRight size={16} />
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Card */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45 }}
              className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-0 border border-[var(--border)] max-w-3xl mx-auto"
            >
              {/* Photo */}
              <div className="relative w-full lg:w-56 aspect-[3/4] lg:aspect-auto overflow-hidden bg-[var(--card)] flex-shrink-0">
                {current.photo ? (
                  <Image
                    src={current.photo}
                    alt={current.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 320px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--card)]">
                    <span className="text-4xl font-light text-[var(--muted)]">
                      {current.name.charAt(0)}
                    </span>
                  </div>
                )}
                {/* Bottom fade */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--background)] to-transparent lg:hidden" />

                {/* Origin badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-[var(--background)]/80 backdrop-blur-sm border border-[var(--border)]">
                  <p className="text-[9px] tracking-[0.25em] uppercase text-[var(--muted)]">{current.origin}</p>
                </div>
              </div>

              {/* Info */}
              <div className="p-7 lg:p-9 flex flex-col justify-between gap-5 bg-[var(--background)]">
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--muted)] mb-4">
                    {current.title}
                  </p>
                  <h3 className="text-2xl lg:text-3xl font-light text-[var(--foreground)] leading-none mb-5">
                    {current.name}
                  </h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed font-light max-w-lg">
                    {current.description}
                  </p>
                </div>

                <div className="flex flex-col gap-6">
                  {/* Platform chips */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] tracking-widest uppercase text-[var(--muted)] mr-2">Platforms</span>
                    {current.platforms.map(p => (
                      <div
                        key={p}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border)] text-[var(--muted)]"
                      >
                        {PLATFORM_ICONS[p]}
                        <span className="text-[10px] tracking-widest uppercase">{p}</span>
                      </div>
                    ))}
                  </div>

                  {/* Dots indicator */}
                  {INFLUENCERS.length > 1 && (
                    <div className="flex items-center gap-2">
                      {INFLUENCERS.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                          className={`h-px transition-all duration-300 ${
                            i === index
                              ? "w-8 bg-[var(--foreground)]"
                              : "w-4 bg-[var(--border)]"
                          }`}
                          aria-label={`Go to ${INFLUENCERS[i].name}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
