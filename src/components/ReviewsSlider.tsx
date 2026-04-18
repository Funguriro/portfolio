"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import fallbackData from "@/data/reviews.json";

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

export default function ReviewsSlider() {
  const [reviews, setReviews] = useState<Review[]>(fallbackData as Review[]);
  const [rating, setRating] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => {
        if (data.reviews?.length) {
          // Keep Google's default order (most recent first)
          setReviews(data.reviews);
          setRating(data.rating);
          setTotal(data.total);
        }
      })
      .catch(() => {});
  }, []);

  const displayed = reviews.filter((r) => r.content?.trim().length > 0);
  const doubled = [...displayed, ...displayed];

  return (
    <section className="py-24 border-t border-[var(--border)] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between"
        >
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-2">
              Google Reviews
            </p>
            <h2 className="text-2xl font-light text-[var(--foreground)]">What people say</h2>
          </div>

          {rating && total && (
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-end gap-1 group"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-light text-[var(--foreground)]">{rating.toFixed(1)}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={
                        i < Math.round(rating)
                          ? "fill-[var(--foreground)] text-[var(--foreground)]"
                          : "text-[var(--border)]"
                      }
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors underline underline-offset-2">
                {total} Google reviews
              </p>
            </a>
          )}
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--background)] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--background)] to-transparent z-10 pointer-events-none" />

        <div className="flex animate-scroll-x">
          {doubled.map((review, i) => (
            <div
              key={`${review.id}-${i}`}
              className="flex-shrink-0 w-80 mx-3 p-6 border border-[var(--border)] bg-[var(--card)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      size={12}
                      className={
                        j < review.rating
                          ? "fill-[var(--foreground)] text-[var(--foreground)]"
                          : "text-[var(--border)]"
                      }
                    />
                  ))}
                </div>
                {/* Google G mark */}
                <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-30">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="currentColor"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="currentColor"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="currentColor"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              <blockquote className="text-sm text-[var(--foreground)] leading-relaxed mb-5 font-light line-clamp-4">
                "{review.content}"
              </blockquote>

              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xs font-medium text-[var(--foreground)]">{review.name}</p>
                  <p className="text-[10px] text-[var(--muted)]">Google reviewer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
