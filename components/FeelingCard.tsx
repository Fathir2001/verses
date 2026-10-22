"use client";

import type { Feeling } from "@/types/feeling";
import Link from "next/link";
import { memo } from "react";
import { FavoriteButton } from "./FavoriteButton";
import { GlassCard } from "./GlassCard";

interface FeelingCardProps {
  feeling: Feeling;
  index: number;
}

export const FeelingCard = memo(function FeelingCard({
  feeling,
  index,
}: FeelingCardProps) {
  // Cap stagger delay so cards beyond the first row don't wait too long
  const delay = Math.min(index * 0.05, 0.3);
  const accents = [
    "from-amber-400/30 via-orange-300/10 to-transparent",
    "from-sky-400/30 via-cyan-300/10 to-transparent",
    "from-violet-400/25 via-rose-300/10 to-transparent",
    "from-emerald-400/25 via-teal-300/10 to-transparent",
  ];
  const accent = accents[index % accents.length];

  return (
    <div
      className="relative animate-fade-in-up"
      style={{ animationDelay: `${delay}s` }}
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
          className="p-5 sm:p-6 h-full min-h-[230px] group relative overflow-hidden"
        >
          <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${accent} pointer-events-none`} />

          <div className="flex flex-col h-full relative z-[1]">
            <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/50 bg-white/50 text-3xl shadow-sm dark:border-white/10 dark:bg-white/10" aria-hidden="true">{feeling.emoji}</span>

            <h2
              className="text-xl font-semibold text-slate-900 dark:text-white mb-2
                           group-hover:text-emerald-600 dark:group-hover:text-emerald-400 
                           transition-colors duration-200"
            >
              {feeling.title}
            </h2>

            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 line-clamp-2 flex-grow">
              {feeling.preview}
            </p>

            <div
              className="mt-5 flex items-center justify-between border-t border-slate-300/40 pt-3 text-xs font-semibold text-emerald-800 dark:border-white/10 dark:text-emerald-300"
            >
              <span>Verse · reflection · dua</span>
              <span className="flex items-center gap-1">
                Explore
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
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
              </span>
            </div>
          </div>
        </GlassCard>
      </Link>
    </div>
  );
});
