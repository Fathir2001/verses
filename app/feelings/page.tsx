"use client";

import {
  FeelingCard,
  FeelingOfTheDay,
  IslamicDateBanner,
  PageTransition,
  SearchBox,
} from "@/components";
import { getAllFeelings, searchFeelings } from "@/lib/feelings";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

// Pre-compute static data outside component
const allFeelings = getAllFeelings();

export default function FeelingsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFeelings = useMemo(() => {
    return searchFeelings(searchQuery);
  }, [searchQuery]);

  const noResults = searchQuery && filteredFeelings.length === 0;
  const showFeelingOfDay = !searchQuery;

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        {/* Islamic Date Banner */}
        <div className="mb-6">
          <IslamicDateBanner />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <h1
            className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 
                         dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-3"
          >
            How are you feeling?
          </h1>
          <p className="text-slate-700 dark:text-slate-300 max-w-lg mx-auto">
            Select what resonates with you, and find comfort through Islamic
            teachings.
          </p>
        </motion.div>

        {/* Feeling of the Day */}
        {showFeelingOfDay && (
          <div className="mb-10">
            <FeelingOfTheDay feelings={allFeelings} />
          </div>
        )}

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <SearchBox
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search feelings..."
          />
        </div>

        {/* Results count */}
        {searchQuery && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6"
          >
            {filteredFeelings.length} of {allFeelings.length} feelings
          </motion.p>
        )}

        {/* Section title */}
        {!searchQuery && (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-6 flex items-center gap-2"
          >
            <span>🎭</span> All Feelings
          </motion.h2>
        )}

        {/* Feelings Grid */}
        {noResults ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <span className="text-5xl mb-4 block">🔍</span>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
              No feelings match &quot;{searchQuery}&quot;
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Try a different search term or browse all feelings below.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400
                         hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded"
            >
              Clear search
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            layout
          >
            {filteredFeelings.map((feeling, index) => (
              <FeelingCard key={feeling.slug} feeling={feeling} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
