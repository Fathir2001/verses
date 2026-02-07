"use client";

import { FeelingCard } from "@/components/FeelingCard";
import { GlassCard } from "@/components/GlassCard";
import { PageTransition } from "@/components/PageTransition";
import { useFavorites } from "@/context/FavoritesContext";
import { getAllFeelings } from "@/lib/feelings";
import { motion } from "framer-motion";
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
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.span
            className="text-5xl sm:text-6xl block mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            💖
          </motion.span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-4">
            Your Saved Favorites
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Feelings you&apos;ve saved to revisit when you need comfort.
          </p>
        </motion.div>

        {/* Content */}
        {favoriteFeelings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteFeelings.map((feeling, index) => (
              <FeelingCard key={feeling.slug} feeling={feeling} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GlassCard className="p-8 text-center max-w-md mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                className="text-6xl mb-4"
              >
                🤍
              </motion.div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                No Favorites Yet
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
          </motion.div>
        )}

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
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
        </motion.div>
      </div>
    </PageTransition>
  );
}
