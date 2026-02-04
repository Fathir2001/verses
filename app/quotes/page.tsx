"use client";

import { CopyButton, GlassCard, PageTransition, SearchBox } from "@/components";
import { getAllCategories, getDailyQuote, searchQuotes } from "@/lib/quotes";
import type { Quote } from "@/types/quote";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";

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
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <motion.span
            className="text-5xl sm:text-6xl block mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            💬
          </motion.span>
          <h1
            className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 
                       dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-3"
          >
            Inspirational Quotes
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
            Hadith and Quranic wisdom to inspire and guide your soul.
          </p>
        </motion.div>

        {/* Quote of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <GlassCard glow className="p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
              <span className="text-[8rem]">✨</span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🌟</span>
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Quote of the Day
              </span>
            </div>

            <blockquote className="border-l-4 border-emerald-500/50 pl-4 py-2">
              <p
                className="text-xl sm:text-2xl text-right leading-loose font-arabic text-slate-800 dark:text-white mb-4"
                dir="rtl"
              >
                {dailyQuote.arabic}
              </p>
              <p className="text-lg sm:text-xl italic text-slate-700 dark:text-slate-200 mb-3">
                &ldquo;{dailyQuote.text}&rdquo;
              </p>
              <div className="flex items-center justify-between">
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
        </motion.div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-6">
          <SearchBox
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search quotes..."
          />
        </div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${
                !selectedCategory
                  ? "bg-emerald-500 text-white shadow-md"
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
                    ? "bg-emerald-500 text-white shadow-md"
                    : "bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                }`}
            >
              <span>{category.emoji}</span>
              <span className="hidden sm:inline">{category.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Results count */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">
          {filteredQuotes.length} quotes
        </p>

        {/* Quotes Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
          layout
        >
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
        </motion.div>

        {filteredQuotes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <span className="text-5xl mb-4 block">🔍</span>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
              No quotes found
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Try a different search term or category.
            </p>
          </motion.div>
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

function QuoteCard({ quote, index, formatQuoteText }: QuoteCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
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
}
