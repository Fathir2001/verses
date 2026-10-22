"use client";

import { FeelingCard } from "@/components/FeelingCard";
import { IslamicDateBanner } from "@/components/IslamicDateBanner";
import { PageTransition } from "@/components/PageTransition";
import { SearchBox } from "@/components/SearchBox";
import { getAllFeelings, searchFeelings } from "@/lib/feelings";
import { useMemo, useState } from "react";

// Pre-compute static data outside component
const allFeelings = getAllFeelings();

export default function FeelingsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFeelings = useMemo(() => {
    return searchFeelings(searchQuery);
  }, [searchQuery]);

  const noResults = searchQuery && filteredFeelings.length === 0;

  return (
    <PageTransition>
      <div className="site-shell mx-auto my-5 max-w-5xl px-4 py-7 sm:my-8 sm:px-8 sm:py-10">
        {/* Islamic Date Banner */}
        <div className="mb-5">
          <IslamicDateBanner />
        </div>

        {/* Header */}
        <div className="text-center mb-7 animate-fade-in-up">
          <p className="section-eyebrow mb-3">A moment for your heart</p>
          <h1
            className="mb-3 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl"
          >
            How are you feeling?
          </h1>
          <p className="mx-auto max-w-lg text-base leading-relaxed text-slate-700 dark:text-slate-200">
            Select what resonates with you, and find comfort through Islamic
            teachings.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-9">
          <SearchBox
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search feelings..."
          />
        </div>

        {/* Results count */}
        {searchQuery && (
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6 animate-fade-in-up">
            {filteredFeelings.length} of {allFeelings.length} feelings
          </p>
        )}

        {/* Section title */}
        {!searchQuery && (
          <div className="mb-5 flex items-end justify-between gap-3 animate-fade-in-up animate-delay-300">
            <div>
              <p className="section-eyebrow mb-1">Explore</p>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">All feelings</h2>
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{allFeelings.length} paths to comfort</span>
          </div>
        )}

        {/* Feelings Grid */}
        {noResults ? (
          <div className="text-center py-12 animate-fade-in-up">
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
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredFeelings.map((feeling, index) => (
              <FeelingCard key={feeling.slug} feeling={feeling} index={index} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
