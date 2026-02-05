"use client";

import {
  CopyButton,
  FavoriteButton,
  GlassCard,
  PageTransition,
  SectionBlock,
  ShareButton,
  WallpaperGenerator,
} from "@/components";
import type { Feeling } from "@/types/feeling";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

interface FeelingDetailClientProps {
  feeling: Feeling;
}

export default function FeelingDetailClient({
  feeling,
}: FeelingDetailClientProps) {
  // State for navigating multiple verses/duas
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [currentDuaIndex, setCurrentDuaIndex] = useState(0);

  // Get verses and duas arrays (use backward-compatible fields if arrays not available)
  const verses = feeling.verses?.length
    ? feeling.verses
    : feeling.quran
      ? [feeling.quran]
      : [];
  const duas = feeling.duas?.length
    ? feeling.duas
    : feeling.dua
      ? [feeling.dua]
      : [];

  // Current verse and dua
  const currentVerse = verses[currentVerseIndex] || null;
  const currentDua = duas[currentDuaIndex] || null;

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `/feelings/${feeling.slug}`;

  const verseText = currentVerse
    ? currentVerse.arabic
      ? `${currentVerse.arabic}\n\n${currentVerse.text}\n\n— ${currentVerse.reference}`
      : `${currentVerse.text}\n\n— ${currentVerse.reference}`
    : "";
  const duaText = currentDua
    ? currentDua.arabic
      ? `${currentDua.arabic}\n\n${currentDua.transliteration}\n\n"${currentDua.meaning}"\n\n— ${currentDua.reference || ""}`
      : `${currentDua.transliteration}\n\n"${currentDua.meaning}"\n\n— ${currentDua.reference || ""}`
    : "";

  // Navigation helpers
  const hasMultipleVerses = verses.length > 1;
  const hasMultipleDuas = duas.length > 1;

  const goToPrevVerse = () =>
    setCurrentVerseIndex((prev) => (prev > 0 ? prev - 1 : verses.length - 1));
  const goToNextVerse = () =>
    setCurrentVerseIndex((prev) => (prev < verses.length - 1 ? prev + 1 : 0));
  const goToPrevDua = () =>
    setCurrentDuaIndex((prev) => (prev > 0 ? prev - 1 : duas.length - 1));
  const goToNextDua = () =>
    setCurrentDuaIndex((prev) => (prev < duas.length - 1 ? prev + 1 : 0));

  // Navigation button component
  const NavButton = ({
    direction,
    onClick,
    disabled,
  }: {
    direction: "prev" | "next";
    onClick: () => void;
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
        disabled
          ? "bg-white/10 dark:bg-slate-700/30 text-slate-400 border-white/10 cursor-not-allowed"
          : "bg-emerald-500 text-white border-emerald-400/60 shadow-md shadow-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/40 hover:brightness-105"
      }`}
      aria-label={direction === "prev" ? "Previous" : "Next"}
      aria-disabled={disabled}
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
          d={direction === "prev" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </svg>
      <span className="text-sm font-semibold">
        {direction === "prev" ? "Prev" : "Next"}
      </span>
    </button>
  );

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl px-4 py-6 sm:py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Link
            href="/feelings"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
                       text-slate-800 dark:text-slate-200 font-bold
                       hover:bg-white/50 dark:hover:bg-slate-800/50
                       transition-colors duration-200
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>All Feelings</span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <motion.span
            className="text-6xl sm:text-7xl block mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            {feeling.emoji}
          </motion.span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-2">
            Feeling {feeling.title}
          </h1>
          <p className="text-slate-800 dark:text-slate-200 mb-4 font-bold">
            {feeling.preview}
          </p>
          <FavoriteButton slug={feeling.slug} size="md" showLabel />
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          {/* Gentle Reminder */}
          <SectionBlock title="Gentle Reminder" icon="💝" delay={0.1}>
            <p className="leading-relaxed">{feeling.reminder}</p>
          </SectionBlock>

          {/* Qur'an Verse */}
          <SectionBlock title="Qur'anic Comfort" icon="📖" delay={0.2}>
            {currentVerse ? (
              <>
                {/* Navigation header for multiple verses */}
                {verses.length > 0 && (
                  <div className="flex items-center justify-between mb-4">
                    <NavButton
                      direction="prev"
                      onClick={goToPrevVerse}
                      disabled={!hasMultipleVerses}
                    />
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Verse {currentVerseIndex + 1} of {verses.length}
                    </span>
                    <NavButton
                      direction="next"
                      onClick={goToNextVerse}
                      disabled={!hasMultipleVerses}
                    />
                  </div>
                )}
                <blockquote className="border-l-4 border-emerald-500/50 pl-4 py-2 mb-4">
                  {currentVerse.arabic && (
                    <p
                      className="text-2xl sm:text-3xl text-right leading-loose font-arabic text-slate-800 dark:text-white mb-4"
                      dir="rtl"
                    >
                      {currentVerse.arabic}
                    </p>
                  )}
                  <p className="text-lg leading-relaxed italic mb-2">
                    &ldquo;{currentVerse.text}&rdquo;
                  </p>
                  <cite className="text-sm text-emerald-600 dark:text-emerald-400 not-italic font-medium">
                    {currentVerse.reference}
                  </cite>
                </blockquote>
                <CopyButton text={verseText} label="Copy Verse" />
              </>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 italic">
                No verse linked to this feeling yet.
              </p>
            )}
          </SectionBlock>

          {/* Dua */}
          <SectionBlock title="Dua for You" icon="🤲" delay={0.3}>
            {currentDua ? (
              <>
                {/* Navigation header for multiple duas */}
                {duas.length > 0 && (
                  <div className="flex items-center justify-between mb-4">
                    <NavButton
                      direction="prev"
                      onClick={goToPrevDua}
                      disabled={!hasMultipleDuas}
                    />
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Dua {currentDuaIndex + 1} of {duas.length}
                    </span>
                    <NavButton
                      direction="next"
                      onClick={goToNextDua}
                      disabled={!hasMultipleDuas}
                    />
                  </div>
                )}
                <div className="space-y-4 mb-4">
                  {currentDua.arabic && (
                    <p
                      className="text-2xl sm:text-3xl text-right leading-loose font-arabic text-slate-800 dark:text-white"
                      dir="rtl"
                    >
                      {currentDua.arabic}
                    </p>
                  )}
                  <p className="text-base sm:text-lg italic text-slate-600 dark:text-slate-300">
                    {currentDua.transliteration}
                  </p>
                  <p className="text-base leading-relaxed">
                    <span className="font-medium">Meaning: </span>
                    &ldquo;{currentDua.meaning}&rdquo;
                  </p>
                  {currentDua.reference && (
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      — {currentDua.reference}
                    </p>
                  )}
                </div>
                <CopyButton text={duaText} label="Copy Dua" />
              </>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 italic">
                No dua linked to this feeling yet.
              </p>
            )}
          </SectionBlock>

          {/* Small Actions */}
          <SectionBlock
            title="Small Actions You Can Take"
            icon="✨"
            delay={0.4}
          >
            <ul className="space-y-3">
              {feeling.actions.map((action, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 
                                 flex items-center justify-center text-sm font-medium 
                                 text-emerald-700 dark:text-emerald-300"
                  >
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{action}</span>
                </motion.li>
              ))}
            </ul>
          </SectionBlock>

          {/* Wallpaper Generator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <WallpaperGenerator feeling={feeling} />
          </motion.div>
        </div>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="mt-8"
        >
          <GlassCard className="p-6 text-center">
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Know someone who might need this? Share it with them.
            </p>
            <ShareButton
              title={`I Am Feeling ${feeling.title}`}
              text={feeling.preview}
              url={shareUrl}
            />
          </GlassCard>
        </motion.div>

        {/* Bottom Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="mt-8 text-center"
        >
          <Link
            href="/feelings"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl
                       bg-gradient-to-r from-emerald-500 to-teal-500
                       text-white font-medium shadow-lg shadow-emerald-500/25
                       hover:shadow-xl hover:shadow-emerald-500/30
                       transition-shadow duration-300
                       focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2"
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
            Explore Other Feelings
          </Link>
        </motion.div>
      </div>
    </PageTransition>
  );
}
