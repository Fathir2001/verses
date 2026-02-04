"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  if (!mounted || reducedMotion) {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/background.jpeg')" }}
        />
        <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/50" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/background.jpeg')" }}
      />
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/50" />

      {/* Animated blobs */}
      <motion.div
        className="absolute top-0 -left-40 w-80 h-80 bg-emerald-300/30 dark:bg-emerald-500/10 
                   rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 100, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/3 right-0 w-96 h-96 bg-teal-300/30 dark:bg-teal-500/10 
                   rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl"
        animate={{
          x: [0, -70, 0],
          y: [0, 50, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <motion.div
        className="absolute bottom-0 left-1/3 w-72 h-72 bg-cyan-300/30 dark:bg-cyan-500/10 
                   rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -60, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}
