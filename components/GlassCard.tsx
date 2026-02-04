"use client";

import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function GlassCard({
  children,
  className,
  hover = false,
  glow = false,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "relative rounded-3xl overflow-hidden",
        "bg-white dark:bg-slate-800/95",
        "backdrop-blur-xl",
        "border border-slate-200/80 dark:border-white/10",
        "shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50",
        hover && "cursor-pointer",
        glow &&
          "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-emerald-500/10 before:to-teal-500/10 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
        className,
      )}
      whileHover={
        hover
          ? {
              scale: 1.02,
              boxShadow: "0 20px 50px -12px rgba(0, 0, 0, 0.15)",
            }
          : undefined
      }
      whileTap={hover ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
