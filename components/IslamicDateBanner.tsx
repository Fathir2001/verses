"use client";

import {
  formatIslamicDate,
  getCurrentOccasion,
  toIslamicDate,
} from "@/lib/islamicCalendar";
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
      <div className="animate-fade-in-up">
        <GlassCard className="p-3 sm:p-5 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] sm:text-[12rem] pointer-events-none">
              🌙
            </div>
          </div>

          <div className="relative flex items-center justify-between gap-3 sm:gap-4">
            {/* Left: Moon icon with CSS animation */}
            <div className="flex-shrink-0 animate-moon-wobble">
              <div
                className="w-11 h-11 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 
                              flex items-center justify-center shadow-lg shadow-emerald-500/30"
              >
                <span className="text-xl sm:text-3xl">🌙</span>
              </div>
            </div>

            {/* Center: Date info */}
            <div className="flex-grow text-center min-w-0">
              <p className="text-sm sm:text-xl font-bold text-slate-800 dark:text-white truncate animate-fade-in-up animate-delay-100">
                {islamicDate}
              </p>
              <p className="text-[10px] sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-0.5 truncate animate-fade-in-up animate-delay-200">
                {gregorianDate}
              </p>
            </div>

            {/* Right: Decorative stars */}
            <div className="flex-shrink-0 flex flex-col gap-0.5 sm:gap-1 animate-twinkle">
              <span className="text-sm sm:text-lg">✨</span>
              <span className="text-xs sm:text-sm">⭐</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Special Occasion Banner */}
      {occasion && (
        <div className="animate-fade-in-up animate-delay-200">
          <GlassCard
            glow
            className={`p-4 sm:p-5 bg-gradient-to-r ${typeStyles[occasion.type]} border-2`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl 
                           bg-white/50 dark:bg-slate-800/50 flex items-center justify-center animate-gentle-pulse"
              >
                <span className="text-2xl sm:text-3xl">{occasion.emoji}</span>
              </div>

              <div className="flex-grow min-w-0">
                <h3 className="font-bold text-slate-800 dark:text-white text-base sm:text-lg">
                  {occasion.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                  {occasion.message}
                </p>
              </div>

              <div className="flex-shrink-0 animate-twinkle">
                <span className="text-2xl">✨</span>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
