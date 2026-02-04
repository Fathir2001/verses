"use client";

import {
  formatIslamicDate,
  getCurrentOccasion,
  toIslamicDate,
} from "@/lib/islamicCalendar";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GlassCard } from "./GlassCard";

export function IslamicDateBanner() {
  const [mounted, setMounted] = useState(false);
  const [islamicDate, setIslamicDate] = useState<string>("");
  const [occasion, setOccasion] =
    useState<ReturnType<typeof getCurrentOccasion>>(null);
  const [gregorianDate, setGregorianDate] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    const hijriDate = toIslamicDate(now);
    setIslamicDate(formatIslamicDate(hijriDate));
    setOccasion(getCurrentOccasion());
    setGregorianDate(
      now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    );
  }, []);

  if (!mounted) {
    return (
      <div className="h-20 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 animate-pulse" />
    );
  }

  const typeStyles = {
    holy: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
    blessed: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
    special: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Islamic Date Display - Beautiful Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard className="p-3 sm:p-5 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] sm:text-[12rem] pointer-events-none">
              🌙
            </div>
          </div>

          <div className="relative flex items-center justify-between gap-3 sm:gap-4">
            {/* Left: Moon icon with animation */}
            <motion.div
              className="flex-shrink-0"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div
                className="w-11 h-11 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 
                              flex items-center justify-center shadow-lg shadow-emerald-500/30"
              >
                <span className="text-xl sm:text-3xl">🌙</span>
              </div>
            </motion.div>

            {/* Center: Date info */}
            <div className="flex-grow text-center min-w-0">
              <motion.p
                className="text-sm sm:text-xl font-bold text-slate-800 dark:text-white truncate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {islamicDate}
              </motion.p>
              <motion.p
                className="text-[10px] sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {gregorianDate}
              </motion.p>
            </div>

            {/* Right: Decorative stars */}
            <motion.div
              className="flex-shrink-0 flex flex-col gap-0.5 sm:gap-1"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-sm sm:text-lg">✨</span>
              <span className="text-xs sm:text-sm">⭐</span>
            </motion.div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Special Occasion Banner */}
      <AnimatePresence>
        {occasion && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <GlassCard
              glow
              className={`p-4 sm:p-5 bg-gradient-to-r ${typeStyles[occasion.type]} border-2`}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <motion.div
                  className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl 
                             bg-white/50 dark:bg-slate-800/50 flex items-center justify-center"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  <span className="text-2xl sm:text-3xl">{occasion.emoji}</span>
                </motion.div>

                <div className="flex-grow min-w-0">
                  <h3 className="font-bold text-slate-800 dark:text-white text-base sm:text-lg">
                    {occasion.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                    {occasion.message}
                  </p>
                </div>

                <motion.div
                  className="flex-shrink-0"
                  animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-2xl">✨</span>
                </motion.div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
