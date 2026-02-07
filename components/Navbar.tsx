"use client";

import { useFavorites } from "@/context/FavoritesContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const { favorites } = useFavorites();
  const favoriteCount = favorites.length;
  const router = useRouter();
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Pre-compute letter animations once — avoids recreating 15 objects every render
  const letterElements = useMemo(() => {
    const directions = [
      { x: -80, y: -50 }, { x: 80, y: -50 }, { x: -80, y: 50 },
      { x: 80, y: 50 }, { x: 0, y: -80 }, { x: 0, y: 80 },
      { x: -100, y: 0 }, { x: 100, y: 0 },
    ];
    const rotations = [
      -120, 90, -60, 150, -30, 180, -150, 45, -90, 120, -45, 135, -75, 100, -135,
    ];
    return "Think_Different".split("").map((letter, index) => {
      const dir = directions[index % directions.length];
      const initialRotate = rotations[index % rotations.length];
      return (
        <motion.span
          key={index}
          className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 
                     dark:from-purple-400 dark:via-pink-400 dark:to-orange-400 
                     bg-clip-text text-transparent drop-shadow-sm"
          initial={{ opacity: 0, x: dir.x, y: dir.y, scale: 0, rotate: initialRotate }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
          transition={{ delay: 1.0 + index * 0.15, duration: 0.8, type: "spring", stiffness: 150, damping: 12 }}
          whileHover={{ scale: 1.3, y: -4, transition: { duration: 0.2 } }}
          style={{ display: "inline-block" }}
        >
          {letter}
        </motion.span>
      );
    });
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    clickCountRef.current += 1;

    // Reset timer on each click
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    // If 3 clicks within the time window, navigate to admin
    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      router.push("/admin/login");
      return;
    }

    // Reset click count after 1 second of no clicks
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1000);
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="mx-auto max-w-5xl px-3 sm:px-4 py-2 sm:py-3">
        <div
          className="flex items-center justify-between rounded-2xl bg-white/60 dark:bg-slate-900/60 
                        backdrop-blur-xl border border-white/20 dark:border-white/10 
                        shadow-glass dark:shadow-glass-dark px-3 py-2 sm:px-5 sm:py-2.5"
        >
          <div
            onClick={handleLogoClick}
            className="flex items-center group focus:outline-none focus:ring-2 
                       focus:ring-purple-500/50 rounded-xl px-1 py-1 -mx-1 -my-1 cursor-pointer"
          >
            <motion.div
              className="relative flex items-center gap-2 px-2 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-500/15 via-pink-500/15 to-orange-500/15 
                         dark:from-purple-500/25 dark:via-pink-500/25 dark:to-orange-500/25
                         border-2 border-purple-400/40 dark:border-purple-500/40 
                         shadow-lg shadow-purple-500/10 dark:shadow-purple-500/20 overflow-hidden"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px -12px rgba(168, 85, 247, 0.35)",
              }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {/* Logo */}
              <motion.img
                src="/enhanced_image.png"
                alt="Think Different Logo"
                className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
              />
              {/* Animated shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
              />
              {/* Glow effect behind text */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-orange-400/20 blur-sm" />
              <span className="relative flex text-xs sm:text-lg md:text-xl font-extrabold tracking-wide">
                {letterElements}
              </span>
              <span className="relative mt-0.5 hidden sm:block text-[10px] sm:text-xs font-semibold text-slate-700/90 dark:text-slate-300/90 text-center">
                🤲 I Am Feeling • Islamic Comfort & Guidance
              </span>
            </motion.div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Home Link */}
            <Link
              href="/feelings"
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl
                         bg-white/50 dark:bg-slate-800/50 
                         hover:bg-emerald-50 dark:hover:bg-emerald-900/20
                         transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              aria-label="Go home"
            >
              <motion.span
                className="text-base sm:text-lg"
                whileHover={{ scale: 1.1 }}
              >
                🏠
              </motion.span>
            </Link>

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
