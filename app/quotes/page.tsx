"use client";

import { CopyButton } from "@/components/CopyButton";
import { GlassCard } from "@/components/GlassCard";
import { PageTransition } from "@/components/PageTransition";
import { SearchBox } from "@/components/SearchBox";
import { getAllCategories, getDailyQuote, searchQuotes } from "@/lib/quotes";
import type { Quote } from "@/types/quote";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useCallback, useMemo, useState } from "react";

// Pre-compute static data outside component to avoid re-computation
const categories = getAllCategories();
const dailyQuote = getDailyQuote();

export default function QuotesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredQuotes = useMemo(() => {
    let quotes = searchQuotes(searchQuery);
    if (selectedCategory) {
      const category = categories.find((c) => c.id === selectedCategory);
      if (category) {
        quotes = quotes.filter((q) =>
          category.quotes.some((cq) => cq.id === q.id),
        );
      }
    }
    return quotes;
  }, [searchQuery, selectedCategory]);

  const formatQuoteText = useCallback((quote: Quote): string => {
    return `${quote.arabic}\n\n"${quote.text}"\n\n— ${quote.source}`;
  }, []);

  return (
    <PageTransition>
      <div className="site-shell mx-auto my-5 max-w-5xl px-4 py-7 sm:my-8 sm:px-8 sm:py-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <p className="section-eyebrow mb-3">Words to carry with you</p>
          <h1
            className="mb-3 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl"
          >
            Inspirational Quotes
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
            Hadith and Quranic wisdom to inspire and guide your soul.
          </p>
        </div>

        {/* Quote of the Day */}
        <div className="mb-10 animate-fade-in-up animate-delay-100">
          <GlassCard glow className="relative overflow-hidden border-amber-200/60 p-6 dark:border-amber-200/20 sm:p-10">
            <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-amber-300/10 blur-3xl" />

            <div className="flex items-center gap-2 mb-4">
              <span className="text-amber-600 dark:text-amber-300" aria-hidden="true">✦</span>
              <span className="section-eyebrow">
                Quote of the Day
              </span>
            </div>

            <blockquote className="relative py-2">
              <p
                className="mb-6 text-right font-arabic text-2xl leading-loose text-slate-900 dark:text-white sm:text-3xl"
                dir="rtl"
              >
                {dailyQuote.arabic}
              </p>
              <p className="mb-5 max-w-3xl text-lg leading-relaxed text-slate-800 dark:text-slate-100 sm:text-xl">
                &ldquo;{dailyQuote.text}&rdquo;
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-300/40 pt-4 dark:border-white/10">
                <cite className="text-sm text-emerald-600 dark:text-emerald-400 not-italic font-medium flex items-center gap-2">
                  <span className={dailyQuote.type === "quran" ? "📖" : "📿"}>
                    {dailyQuote.type === "quran" ? "📖" : "📿"}
                  </span>
                  {dailyQuote.source}
                </cite>
                <CopyButton text={formatQuoteText(dailyQuote)} label="Copy" />
              </div>
            </blockquote>
          </GlassCard>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-6">
          <SearchBox
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search quotes..."
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 animate-fade-in-up animate-delay-200">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${
                !selectedCategory
                  ? "bg-emerald-700 text-white shadow-md dark:bg-emerald-500 dark:text-slate-950"
                  : "bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() =>
                setSelectedCategory(
                  category.id === selectedCategory ? null : category.id,
                )
              }
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5
                ${
                  selectedCategory === category.id
                    ? "bg-emerald-700 text-white shadow-md dark:bg-emerald-500 dark:text-slate-950"
                    : "bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                }`}
            >
              <span>{category.emoji}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">
          {filteredQuotes.length} quotes
        </p>

        {/* Quotes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredQuotes.map((quote, index) => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                index={index}
                formatQuoteText={formatQuoteText}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredQuotes.length === 0 && (
          <div className="text-center py-12 animate-fade-in-up">
            <span className="text-5xl mb-4 block">🔍</span>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
              No quotes found
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Try a different search term or category.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}

interface QuoteCardProps {
  quote: Quote;
  index: number;
  formatQuoteText: (quote: Quote) => string;
}

const QuoteCard = memo(function QuoteCard({
  quote,
  index,
  formatQuoteText,
}: QuoteCardProps) {
  const delay = Math.min(index * 0.05, 0.3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay }}
    >
      <GlassCard hover className="p-5 h-full">
        <div className="flex flex-col h-full">
          {/* Arabic Text */}
          <p
            className="text-lg sm:text-xl text-right leading-relaxed font-arabic text-slate-800 dark:text-white mb-3"
            dir="rtl"
          >
            {quote.arabic}
          </p>

          {/* English Translation */}
          <p className="text-sm sm:text-base italic text-slate-600 dark:text-slate-300 mb-4 flex-grow">
            &ldquo;{quote.text}&rdquo;
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs
                  ${
                    quote.type === "quran"
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                      : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                  }`}
              >
                {quote.type === "quran" ? "📖" : "📿"}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {quote.source}
              </span>
            </div>
            <CopyButton text={formatQuoteText(quote)} label="Copy" />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
});
