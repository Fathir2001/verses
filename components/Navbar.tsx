"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="mx-auto max-w-5xl px-4 py-4">
        <div
          className="flex items-center justify-between rounded-2xl bg-white/60 dark:bg-slate-900/60 
                        backdrop-blur-xl border border-white/20 dark:border-white/10 
                        shadow-glass dark:shadow-glass-dark px-4 py-3 sm:px-6"
        >
          <Link
            href="/feelings"
            className="flex items-center gap-2 sm:gap-3 group focus:outline-none focus:ring-2 
                       focus:ring-emerald-500/50 rounded-lg px-2 py-1 -mx-2 -my-1"
          >
            <motion.span
              className="text-2xl sm:text-3xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              🤲
            </motion.span>
            <div className="flex flex-col">
              <span
                className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 
                               dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent"
              >
                I Am Feeling
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 -mt-0.5">
                Islamic Comfort & Guidance
              </span>
            </div>
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  );
}
