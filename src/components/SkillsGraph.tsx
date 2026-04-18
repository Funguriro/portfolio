"use client";

import { motion } from "framer-motion";
import skillsData from "@/data/skills.json";
import { Skill } from "@/types";

const skills = skillsData as Skill[];

const categories = Array.from(new Set(skills.map((s) => s.category)));

export default function SkillsGraph({ inline = false }: { inline?: boolean }) {
  return (
    <div className={inline ? "" : "py-4"}>
      {!inline && (
        <p className="text-xs tracking-widest uppercase text-[var(--muted)] mb-4">Skills</p>
      )}
      <div className="space-y-5">
        {categories.map((cat, ci) => (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: ci * 0.08 }}
          >
            <p className="text-[10px] tracking-widest uppercase text-[var(--muted)] mb-2">
              {cat}
            </p>
            <div className="flex flex-wrap gap-2">
              {skills
                .filter((s) => s.category === cat)
                .map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: ci * 0.08 + i * 0.04 }}
                    className="group relative"
                  >
                    <div
                      className="px-3 py-1.5 border border-[var(--border)] text-xs text-[var(--foreground)] hover:border-[var(--foreground)] transition-all duration-200 cursor-default select-none"
                      style={{
                        opacity: 0.5 + (skill.level / 5) * 0.5,
                      }}
                    >
                      {skill.name}
                    </div>
                    {/* Level indicator */}
                    <div className="absolute -bottom-0.5 left-0 h-0.5 bg-[var(--foreground)] transition-all duration-300 group-hover:opacity-100 opacity-40"
                      style={{ width: `${(skill.level / 5) * 100}%` }}
                    />
                  </motion.div>
                ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
