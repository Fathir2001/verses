"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBox({
  value,
  onChange,
  placeholder = "Search feelings...",
}: SearchBoxProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-14 rounded-2xl bg-white/50 dark:bg-slate-800/50 animate-pulse" />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative rounded-2xl transition-all duration-300 ${
        isFocused
          ? "shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/30"
          : "shadow-glass dark:shadow-glass-dark"
      }`}
    >
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <motion.svg
          className="w-5 h-5 text-slate-400 dark:text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ scale: isFocused ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </motion.svg>
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full h-14 pl-12 pr-4 rounded-2xl
                   bg-white/70 dark:bg-slate-800/70
                   backdrop-blur-xl
                   border border-white/30 dark:border-white/10
                   text-slate-800 dark:text-white
                   placeholder-slate-400 dark:placeholder-slate-500
                   focus:outline-none
                   transition-colors duration-200"
        aria-label="Search feelings"
      />

      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-3 flex items-center text-slate-400 
                     hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          aria-label="Clear search"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </motion.button>
      )}
    </motion.div>
  );
}
