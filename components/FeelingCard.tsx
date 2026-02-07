"use client";

import type { Feeling } from "@/types/feeling";
import { motion } from "framer-motion";
import Link from "next/link";
import { memo } from "react";
import { FavoriteButton } from "./FavoriteButton";
import { GlassCard } from "./GlassCard";

interface FeelingCardProps {
  feeling: Feeling;
  index: number;
}

export const FeelingCard = memo(function FeelingCard({ feeling, index }: FeelingCardProps) {
  // Cap stagger delay so cards beyond the first row don't wait too long
  const delay = Math.min(index * 0.05, 0.3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.4,
        delay,
        ease: "easeOut",
      }}
      className="relative"
    >
      <div className="absolute top-3 right-3 z-10">
        <FavoriteButton slug={feeling.slug} size="sm" />
      </div>
      <Link
        href={`/feelings/${feeling.slug}`}
        className="block focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded-3xl"
      >
        <GlassCard
          hover
          glow
          className="p-6 h-full group relative overflow-hidden"
        >
          {/* Large emoji background decoration */}
          <div className="absolute -bottom-4 -right-4 opacity-[0.07] dark:opacity-[0.1] pointer-events-none select-none">
            <span className="text-[7rem] leading-none">{feeling.emoji}</span>
          </div>

          <div className="flex flex-col h-full relative z-[1]">
            <span className="text-4xl mb-3">{feeling.emoji}</span>

            <h2
              className="text-xl font-semibold text-slate-800 dark:text-white mb-2 
                           group-hover:text-emerald-600 dark:group-hover:text-emerald-400 
                           transition-colors duration-200"
            >
              {feeling.title}
            </h2>

            <p className="text-sm text-slate-800 dark:text-slate-100 line-clamp-2 flex-grow font-bold">
              {feeling.preview}
            </p>

            <div
              className="mt-4 flex items-center text-sm text-emerald-600 dark:text-emerald-400 
                            font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <span>Find comfort</span>
              <motion.svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </motion.svg>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
});
