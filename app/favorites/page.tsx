"use client";

import { FeelingCard } from "@/components/FeelingCard";
import { GlassCard } from "@/components/GlassCard";
import { PageTransition } from "@/components/PageTransition";
import { useFavorites } from "@/context/FavoritesContext";
import { getAllFeelings } from "@/lib/feelings";
import Link from "next/link";
import { useMemo } from "react";

// Pre-compute outside component — this is a synchronous JSON read
const allFeelings = getAllFeelings();

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  const favoriteFeelings = useMemo(
    () => allFeelings.filter((feeling) => favorites.includes(feeling.slug)),
    [favorites],
  );

  return (
    <PageTransition>
      <div className="site-shell mx-auto my-5 max-w-5xl px-4 py-7 sm:my-8 sm:px-8 sm:py-10">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-200/70 bg-rose-100/60 text-2xl shadow-sm backdrop-blur-xl dark:border-rose-200/20 dark:bg-rose-300/10" aria-hidden="true">♡</span>
          <p className="section-eyebrow mb-2">Your quiet corner</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3 sm:text-5xl">
            Saved for you
          </h1>
          <p className="text-slate-700 dark:text-slate-200 max-w-md mx-auto leading-relaxed">
            A place to return to the words that brought you comfort.
          </p>
        </div>

        {/* Content */}
        {favoriteFeelings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favoriteFeelings.map((feeling, index) => (
              <FeelingCard key={feeling.slug} feeling={feeling} index={index} />
            ))}
          </div>
        ) : (
          <div className="animate-fade-in-up animate-delay-200">
            <GlassCard className="p-8 text-center max-w-md mx-auto sm:p-10">
              <div className="mb-4 text-5xl text-rose-500 dark:text-rose-300" aria-hidden="true">♡</div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                Your collection starts here
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Tap the heart icon on any feeling to save it here for easy
                access.
              </p>
              <Link
                href="/feelings"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl
                           bg-gradient-to-r from-emerald-500 to-teal-500
                           text-white font-medium shadow-lg shadow-emerald-500/25
                           hover:shadow-xl hover:shadow-emerald-500/30
                           transition-shadow duration-300
                           focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                Explore Feelings
              </Link>
            </GlassCard>
          </div>
        )}

        {/* Back link */}
        <div className="text-center mt-12 animate-fade-in-up animate-delay-300">
          <Link
            href="/feelings"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
                       text-slate-600 dark:text-slate-300
                       hover:bg-white/50 dark:hover:bg-slate-800/50
                       transition-colors duration-200"
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
            Back to All Feelings
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
