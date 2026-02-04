"use client";

import type { Feeling } from "@/types/feeling";
import { motion } from "framer-motion";
import Link from "next/link";
import { GlassCard } from "./GlassCard";

interface FeelingOfTheDayProps {
  feelings: Feeling[];
}

// Generate a consistent "random" feeling for each day
function getDailyFeeling(feelings: Feeling[]): Feeling {
  const today = new Date();
  // Create a seed from the date (year * 366 + day of year)
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const seed = today.getFullYear() * 366 + dayOfYear;

  // Use the seed to pick a feeling
  const index = seed % feelings.length;
  return feelings[index];
}

export function FeelingOfTheDay({ feelings }: FeelingOfTheDayProps) {
  const dailyFeeling = getDailyFeeling(feelings);

  // Get today's date in a nice format
  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <GlassCard glow className="p-6 sm:p-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 opacity-5 pointer-events-none">
          <span className="text-[8rem] sm:text-[12rem]">
            {dailyFeeling.emoji}
          </span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.span
              className="text-xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
            >
              ✨
            </motion.span>
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Feeling of the Day
            </span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {dateString}
          </span>
        </div>

        {/* Content */}
        <Link href={`/feelings/${dailyFeeling.slug}`} className="block group">
          <div className="flex items-start gap-4 sm:gap-6">
            <motion.span
              className="text-5xl sm:text-6xl flex-shrink-0"
              whileHover={{ scale: 1.15, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {dailyFeeling.emoji}
            </motion.span>

            <div className="flex-grow min-w-0">
              <h3
                className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-2 
                            group-hover:text-emerald-600 dark:group-hover:text-emerald-400 
                            transition-colors duration-200"
              >
                Feeling {dailyFeeling.title}?
              </h3>
              <p className="text-slate-800 dark:text-slate-200 line-clamp-2 sm:line-clamp-3 mb-4 font-bold">
                {dailyFeeling.preview}
              </p>

              {/* Qur'an verse preview */}
              <blockquote className="border-l-3 border-emerald-500/40 pl-3 py-1">
                <p className="text-sm italic text-slate-600 dark:text-slate-400 line-clamp-2">
                  &ldquo;{dailyFeeling.quran.text}&rdquo;
                </p>
                <cite className="text-xs text-emerald-600 dark:text-emerald-400 not-italic">
                  {dailyFeeling.quran.reference}
                </cite>
              </blockquote>
            </div>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <Link
            href={`/feelings/${dailyFeeling.slug}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
                       bg-gradient-to-r from-emerald-500 to-teal-500
                       text-white text-sm font-medium shadow-md shadow-emerald-500/20
                       hover:shadow-lg hover:shadow-emerald-500/30
                       transition-all duration-300"
          >
            Find Comfort
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </GlassCard>
    </motion.div>
  );
}
