"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-white/20 dark:bg-white/10 animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  const cycleTheme = () => {
    if (theme === "system") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("system");
    }
  };

  return (
    <motion.button
      onClick={cycleTheme}
      className="relative w-10 h-10 rounded-xl bg-white/30 dark:bg-white/10 backdrop-blur-md
                 border border-white/20 dark:border-white/10 shadow-glass dark:shadow-glass-dark
                 flex items-center justify-center transition-colors duration-300
                 hover:bg-white/40 dark:hover:bg-white/20 focus:outline-none focus:ring-2 
                 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-transparent"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Current theme: ${theme}. Click to change.`}
    >
      <motion.span
        key={isDark ? "moon" : "sun"}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="text-xl"
      >
        {theme === "system" ? "💻" : isDark ? "🌙" : "☀️"}
      </motion.span>
    </motion.button>
  );
}
