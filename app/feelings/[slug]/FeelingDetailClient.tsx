"use client";

import { CopyButton } from "@/components/CopyButton";
import { FavoriteButton } from "@/components/FavoriteButton";
import { GlassCard } from "@/components/GlassCard";
import { PageTransition } from "@/components/PageTransition";
import { SectionBlock } from "@/components/SectionBlock";
import { ShareButton } from "@/components/ShareButton";
import type { Feeling } from "@/types/feeling";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

// Lazy load the heavy WallpaperGenerator (541 lines + canvas rendering)
const WallpaperGenerator = dynamic(
  () =>
    import("@/components/WallpaperGenerator").then((mod) => ({
      default: mod.WallpaperGenerator,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-32 rounded-3xl bg-white/50 dark:bg-slate-800/50 animate-pulse" />
    ),
  },
);

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
      className={`relative group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
        disabled
          ? "bg-white/10 dark:bg-slate-700/30 text-slate-400 border-white/10 cursor-not-allowed"
          : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-400/60 shadow-lg shadow-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/50 hover:scale-105 active:scale-95"
      }`}
      aria-label={direction === "prev" ? "Previous" : "Next"}
      aria-disabled={disabled}
    >
      {!disabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      )}
      <svg
        className="w-5 h-5 relative z-10"
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
      <span className="text-sm font-bold relative z-10">
        {direction === "prev" ? "Prev" : "Next"}
      </span>
    </button>
  );

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl px-4 py-6 sm:py-8">
        {/* Back Button */}
        <div className="mb-6 animate-fade-in-up">
          <Link
            href="/feelings"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl
                       bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm
                       text-slate-800 dark:text-slate-200 font-bold
                       hover:bg-white/80 dark:hover:bg-slate-800/80
                       hover:shadow-lg hover:shadow-emerald-500/10
                       border border-slate-200/60 dark:border-slate-700/60
                       transition-all duration-300 hover:scale-105 active:scale-95
                       focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
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
        </div>

        {/* Header with Premium Gradient */}
        <div className="relative text-center mb-8 animate-fade-in-up">
          {/* Gradient Background Glow */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 dark:from-emerald-500/5 dark:via-teal-500/5 dark:to-cyan-500/5 blur-3xl rounded-3xl" />

          {/* Emoji Container with Glow */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 via-teal-400/30 to-cyan-400/30 blur-2xl animate-pulse" />
            <div className="relative bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-emerald-500/20 dark:shadow-emerald-500/10 border border-white/60 dark:border-slate-700/60">
              <span className="text-6xl sm:text-7xl block animate-gentle-pulse drop-shadow-2xl">
                {feeling.emoji}
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent mb-3">
            Feeling {feeling.title}
          </h1>
          <p className="text-slate-700 dark:text-slate-300 mb-6 font-semibold text-lg max-w-xl mx-auto leading-relaxed">
            {feeling.preview}
          </p>
          <FavoriteButton slug={feeling.slug} size="md" showLabel />
        </div>

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
                <blockquote className="relative border-l-4 border-emerald-500 dark:border-emerald-400 pl-6 py-3 mb-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-emerald-400 before:via-teal-400 before:to-cyan-400 before:blur-sm">
                  {currentVerse.arabic && (
                    <p
                      className="text-2xl sm:text-3xl text-right leading-loose font-arabic bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent mb-5"
                      dir="rtl"
                    >
                      {currentVerse.arabic}
                    </p>
                  )}
                  <p className="text-lg leading-relaxed italic mb-3 text-slate-700 dark:text-slate-300">
                    &ldquo;{currentVerse.text}&rdquo;
                  </p>
                  <cite className="inline-flex items-center gap-2 text-sm bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent not-italic font-bold">
                    <svg
                      className="w-4 h-4 text-emerald-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
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
                <div className="space-y-5 mb-6">
                  {currentDua.arabic && (
                    <div className="relative bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-2xl p-5 border border-emerald-200/30 dark:border-emerald-700/30">
                      <p
                        className="text-2xl sm:text-3xl text-right leading-loose font-arabic bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent"
                        dir="rtl"
                      >
                        {currentDua.arabic}
                      </p>
                    </div>
                  )}
                  <p className="text-base sm:text-lg italic text-slate-600 dark:text-slate-300 font-medium bg-slate-50/50 dark:bg-slate-800/30 rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50">
                    {currentDua.transliteration}
                  </p>
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl blur" />
                    <p className="relative text-base leading-relaxed bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-700/50">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        Meaning:{" "}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300">
                        &ldquo;{currentDua.meaning}&rdquo;
                      </span>
                    </p>
                  </div>
                  {currentDua.reference && (
                    <p className="text-sm bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent font-bold">
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
            <ul className="space-y-4">
              {feeling.actions.map((action, index) => (
                <li
                  key={index}
                  className="group flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-white/60 to-white/30 dark:from-slate-800/60 dark:to-slate-800/30 hover:from-emerald-50/80 hover:to-teal-50/80 dark:hover:from-emerald-900/20 dark:hover:to-teal-900/20 border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:scale-[1.02]"
                >
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30
                                 flex items-center justify-center text-sm font-bold 
                                 text-white group-hover:scale-110 transition-transform duration-300"
                  >
                    {index + 1}
                  </span>
                  <span className="leading-relaxed font-medium text-slate-700 dark:text-slate-300 flex-1">
                    {action}
                  </span>
                </li>
              ))}
            </ul>
          </SectionBlock>

          {/* Wallpaper Generator */}
          <div className="animate-fade-in-up animate-delay-300">
            <WallpaperGenerator feeling={feeling} />
          </div>
        </div>

        {/* Share Section */}
        <div className="mt-8 animate-fade-in-up animate-delay-300">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            <GlassCard className="relative p-8 text-center border-2 border-emerald-200/30 dark:border-emerald-700/30">
              <div className="mb-4">
                <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 mb-3">
                  <svg
                    className="w-6 h-6 text-emerald-600 dark:text-emerald-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                </div>
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-5 font-semibold text-lg">
                Know someone who might need this? Share it with them.
              </p>
              <ShareButton
                title={`Think Different - Feeling ${feeling.title}`}
                text={feeling.preview}
                url={shareUrl}
              />
            </GlassCard>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 text-center animate-fade-in-up animate-delay-300">
          <Link
            href="/feelings"
            className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl
                       bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500
                       text-white font-bold text-lg shadow-2xl shadow-emerald-500/40
                       hover:shadow-emerald-500/50 hover:scale-105 active:scale-95
                       transition-all duration-300
                       focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2
                       overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <svg
              className="w-6 h-6 relative z-10"
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
            <span className="relative z-10">Explore Other Feelings</span>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
