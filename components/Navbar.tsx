"use client";

import { useFavorites } from "@/context";
import { motion } from "framer-motion";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const { favorites } = useFavorites();
  const favoriteCount = favorites.length;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="mx-auto max-w-5xl px-3 sm:px-4 py-3 sm:py-4">
        <div
          className="flex items-center justify-between rounded-2xl bg-white/60 dark:bg-slate-900/60 
                        backdrop-blur-xl border border-white/20 dark:border-white/10 
                        shadow-glass dark:shadow-glass-dark px-3 py-2.5 sm:px-6 sm:py-3"
        >
          <Link
            href="/feelings"
            className="flex items-center gap-1.5 sm:gap-3 group focus:outline-none focus:ring-2 
                       focus:ring-emerald-500/50 rounded-lg px-1 py-1 -mx-1 -my-1"
          >
            <motion.span
              className="text-xl sm:text-3xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              🤲
            </motion.span>
            <div className="flex flex-col">
              <span
                className="text-sm sm:text-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 
                               dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent"
              >
                I Am Feeling
              </span>
              <span className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 -mt-0.5">
                Islamic Comfort & Guidance
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Quotes Link */}
            <Link
              href="/quotes"
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl
                         bg-white/50 dark:bg-slate-800/50 
                         hover:bg-amber-50 dark:hover:bg-amber-900/20
                         transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              aria-label="View quotes"
            >
              <motion.span
                className="text-base sm:text-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                💬
              </motion.span>
            </Link>

            {/* Favorites Link */}
            <Link
              href="/favorites"
              className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl
                         bg-white/50 dark:bg-slate-800/50 
                         hover:bg-rose-50 dark:hover:bg-rose-900/20
                         transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              aria-label="View favorites"
            >
              <motion.svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                fill={favoriteCount > 0 ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
                whileHover={{ scale: 1.1 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </motion.svg>
              {favoriteCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center
                             bg-rose-500 text-white text-[10px] sm:text-xs font-medium rounded-full"
                >
                  {favoriteCount > 9 ? "9+" : favoriteCount}
                </motion.span>
              )}
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
