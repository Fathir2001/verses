"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-14 h-8 sm:w-16 sm:h-9 rounded-full bg-white/20 dark:bg-white/10 animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative w-14 h-8 sm:w-16 sm:h-9 rounded-full p-1
                 transition-colors duration-500 ease-in-out
                 focus:outline-none focus:ring-2 focus:ring-emerald-500/50
                 ${isDark 
                   ? "bg-slate-700/80 border border-slate-600/50" 
                   : "bg-amber-100/80 border border-amber-200/50"
                 }`}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Track background icons */}
      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-xs sm:text-sm opacity-60">
        ☀️
      </span>
      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-xs sm:text-sm opacity-60">
        🌙
      </span>
      
      {/* Sliding knob */}
      <motion.div
        className={`relative w-6 h-6 sm:w-7 sm:h-7 rounded-full shadow-md flex items-center justify-center
                   ${isDark 
                     ? "bg-slate-800 border border-slate-600" 
                     : "bg-white border border-amber-200"
                   }`}
        layout
        initial={false}
        animate={{
          x: isDark ? "calc(100% + 4px)" : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ duration: 0.3 }}
          className="text-xs sm:text-sm"
        >
          {isDark ? "🌙" : "☀️"}
        </motion.span>
      </motion.div>
    </motion.button>
  );
}
