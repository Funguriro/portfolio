"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";
import timelineData from "@/data/timeline.json";
import { TimelineItem } from "@/types";

const items = timelineData as TimelineItem[];

export default function Timeline({ inline = false }: { inline?: boolean }) {
  return (
    <div id="experience" className={inline ? "" : "py-4"}>
      {!inline && (
        <p className="text-xs tracking-widest uppercase text-[var(--muted)] mb-4">Experience</p>
      )}
      <div className="relative">
        <div className="absolute left-[18px] top-3 bottom-3 w-px bg-[var(--border)]" />

        <div className="space-y-6">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative flex gap-4"
            >
              <div className="relative z-10 flex-shrink-0 w-9 h-9 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center">
                {item.type === "work" ? (
                  <Briefcase size={14} className="text-[var(--muted)]" />
                ) : (
                  <GraduationCap size={14} className="text-[var(--muted)]" />
                )}
              </div>

              <div className="pb-2 flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h3 className="text-sm font-medium text-[var(--foreground)]">{item.title}</h3>
                    <p className="text-xs text-[var(--muted)]">{item.company}</p>
                  </div>
                  <span className="text-xs text-[var(--muted)] flex-shrink-0 tracking-wide">
                    {item.period}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed mt-2">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
