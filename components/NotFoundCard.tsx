"use client";

import Link from "next/link";
import { GlassCard } from "./GlassCard";

export function NotFoundCard() {
  return (
    <div className="max-w-md mx-auto animate-fade-in-up">
      <GlassCard className="p-8 text-center">
        <span className="text-6xl block mb-4 animate-moon-wobble">🤔</span>

        <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-3">
          Feeling Not Found
        </h2>

        <p className="text-slate-600 dark:text-slate-300 mb-6">
          We couldn&apos;t find the feeling you&apos;re looking for. Perhaps try
          exploring our other feelings?
        </p>

        <Link href="/feelings">
          <span
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl
                       bg-gradient-to-r from-emerald-500 to-teal-500
                       text-white font-medium shadow-lg shadow-emerald-500/25
                       hover:shadow-xl hover:shadow-emerald-500/30
                       transition-all duration-300
                       hover:scale-[1.02] active:scale-[0.98]"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Explore Feelings
          </span>
        </Link>
      </GlassCard>
    </div>
  );
}
