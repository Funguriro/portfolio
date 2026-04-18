"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { MessageCircle, Calendar, X, Phone } from "lucide-react";
import profileData from "@/data/profile.json";

export default function FloatingCTA() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const whatsappUrl = `https://wa.me/${profileData.whatsapp}`;
  const calendlyUrl = profileData.calendly;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
        >
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-2"
              >
                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 bg-[var(--foreground)] text-[var(--background)] text-xs tracking-widest uppercase hover:opacity-90 transition-opacity shadow-lg"
                >
                  <Calendar size={14} />
                  Schedule a meeting
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] text-xs tracking-widest uppercase hover:border-[var(--foreground)] transition-all shadow-lg"
                >
                  <Phone size={14} />
                  WhatsApp
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setOpen((o) => !o)}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className="w-12 h-12 rounded-full bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center shadow-xl"
            aria-label="Contact options"
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={18} />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <MessageCircle size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
