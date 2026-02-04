"use client";

import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";

interface SectionBlockProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  delay?: number;
}

export function SectionBlock({
  title,
  icon,
  children,
  delay = 0,
}: SectionBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut",
      }}
    >
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
            {title}
          </h3>
        </div>
        <div className="text-slate-700 dark:text-slate-200">{children}</div>
      </GlassCard>
    </motion.div>
  );
}
