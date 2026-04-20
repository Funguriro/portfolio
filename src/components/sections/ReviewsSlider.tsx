"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
interface Review {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string | null;
}

const GOOGLE_REVIEWS_URL = `https://search.google.com/local/reviews?placeid=${process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || "ChIJSb69upu7MRkRpmfPs1WUNHs"}`;
const PER_PAGE = 2;

const GoogleMark = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" className="opacity-40 flex-shrink-0" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
  </svg>
);

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={11}
          className={i < rating ? "fill-amber-400 text-amber-400" : "text-[var(--border)]"}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative flex flex-col gap-5 p-7 border border-[var(--border)] bg-[var(--background)] hover:border-[var(--foreground)]/30 transition-colors duration-300 overflow-hidden"
    >
      {/* Decorative quote */}
      <span
        className="absolute -top-3 -left-1 text-8xl font-serif leading-none text-[var(--foreground)] opacity-[0.04] select-none pointer-events-none"
        aria-hidden="true"
      >
        "
      </span>

      {/* Top row: stars + Google */}
      <div className="flex items-center justify-between">
        <StarRow rating={review.rating} />
        <GoogleMark />
      </div>

      {/* Review text */}
      <blockquote className="flex-1 text-sm text-[var(--foreground)] leading-relaxed font-light line-clamp-5 opacity-80">
        {review.content}
      </blockquote>

      {/* Reviewer */}
      <div className="pt-5 border-t border-[var(--border)] flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-light text-[var(--muted)] uppercase">
            {review.name.charAt(0)}
          </span>
        </div>
        <div>
          <p className="text-xs font-light text-[var(--foreground)]">{review.name}</p>
          <p className="text-[10px] tracking-widest uppercase text-[var(--muted)]">Google Review</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function ReviewsSlider() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating]   = useState<number | null>(null);
  const [total, setTotal]     = useState<number | null>(null);
  const [page, setPage]       = useState(0);

  useEffect(() => {
    fetch("/api/reviews")
      .then(r => r.json())
      .then(data => {
        if (data.rating)          setRating(data.rating);
        if (data.total)           setTotal(data.total);
        if (data.reviews?.length) setReviews(data.reviews);
      })
      .catch(() => {});
  }, []);

  const displayed  = reviews.filter(r => r.content?.trim().length > 0).slice(0, 12);
  const pageCount  = Math.ceil(displayed.length / PER_PAGE);
  const pageSlice  = displayed.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const next = useCallback(() => setPage(p => (p + 1) % pageCount), [pageCount]);

  // Auto-cycle pages
  useEffect(() => {
    if (pageCount < 2) return;
    const id = setInterval(next, 7000);
    return () => clearInterval(id);
  }, [next, pageCount]);

  return (
    <section className="py-24 border-b border-[var(--border)] relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-64 bg-[radial-gradient(ellipse_at_top_left,rgba(251,191,36,0.04),transparent_70%)]" />
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
        >
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-3 flex items-center gap-2">
              <motion.span
                className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.5, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              Google Reviews
            </p>
            <h2 className="text-3xl lg:text-4xl font-light text-[var(--foreground)] leading-tight">
              What people say<br />
              <span className="opacity-30">about working with me</span>
            </h2>
          </div>

          {rating && total ? (
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-shrink-0 border border-[var(--border)] px-6 py-4 hover:border-[var(--foreground)] transition-colors text-right"
            >
              <div className="flex items-center justify-end gap-2 mb-1">
                <span className="text-3xl font-light text-[var(--foreground)]">{rating.toFixed(1)}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} className={i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-[var(--border)]"} />
                  ))}
                </div>
              </div>
              <p className="text-[10px] tracking-widest uppercase text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors">
                {total} reviews on Google
              </p>
            </a>
          ) : null}
        </motion.div>

        {/* Review grid with fade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {pageSlice.map((review, i) => (
              <ReviewCard key={review.id} review={review} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {pageCount > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex items-center gap-3 mt-8"
          >
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-px transition-all duration-300 ${
                  i === page ? "w-10 bg-[var(--foreground)]" : "w-4 bg-[var(--border)]"
                }`}
                aria-label={`Page ${i + 1}`}
              />
            ))}
            <span className="text-[10px] tracking-widest uppercase text-[var(--muted)] ml-2">
              {page + 1} / {pageCount}
            </span>
          </motion.div>
        )}

      </div>
    </section>
  );
}
