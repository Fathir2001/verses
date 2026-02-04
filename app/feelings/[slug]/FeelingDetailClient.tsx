"use client";

import {
  CopyButton,
  GlassCard,
  PageTransition,
  SectionBlock,
  ShareButton,
} from "@/components";
import type { Feeling } from "@/types/feeling";
import { motion } from "framer-motion";
import Link from "next/link";

interface FeelingDetailClientProps {
  feeling: Feeling;
}

export default function FeelingDetailClient({
  feeling,
}: FeelingDetailClientProps) {
  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `/feelings/${feeling.slug}`;

  const verseText = `${feeling.quran.text}\n\n— ${feeling.quran.reference}`;
  const duaText = feeling.dua.arabic
    ? `${feeling.dua.arabic}\n\n${feeling.dua.transliteration}\n\n"${feeling.dua.meaning}"\n\n— ${feeling.dua.reference || ""}`
    : `${feeling.dua.transliteration}\n\n"${feeling.dua.meaning}"\n\n— ${feeling.dua.reference || ""}`;

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
                       text-slate-600 dark:text-slate-300
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
          <p className="text-slate-600 dark:text-slate-300">
            {feeling.preview}
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          {/* Gentle Reminder */}
          <SectionBlock title="Gentle Reminder" icon="💝" delay={0.1}>
            <p className="leading-relaxed">{feeling.reminder}</p>
          </SectionBlock>

          {/* Qur'an Verse */}
          <SectionBlock title="Qur'anic Comfort" icon="📖" delay={0.2}>
            <blockquote className="border-l-4 border-emerald-500/50 pl-4 py-2 mb-4">
              <p className="text-lg leading-relaxed italic mb-2">
                &ldquo;{feeling.quran.text}&rdquo;
              </p>
              <cite className="text-sm text-emerald-600 dark:text-emerald-400 not-italic font-medium">
                {feeling.quran.reference}
              </cite>
            </blockquote>
            <CopyButton text={verseText} label="Copy Verse" />
          </SectionBlock>

          {/* Dua */}
          <SectionBlock title="Dua for You" icon="🤲" delay={0.3}>
            <div className="space-y-4 mb-4">
              {feeling.dua.arabic && (
                <p
                  className="text-2xl sm:text-3xl text-right leading-loose font-arabic text-slate-800 dark:text-white"
                  dir="rtl"
                >
                  {feeling.dua.arabic}
                </p>
              )}
              <p className="text-base sm:text-lg italic text-slate-600 dark:text-slate-300">
                {feeling.dua.transliteration}
              </p>
              <p className="text-base leading-relaxed">
                <span className="font-medium">Meaning: </span>
                &ldquo;{feeling.dua.meaning}&rdquo;
              </p>
              {feeling.dua.reference && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  — {feeling.dua.reference}
                </p>
              )}
            </div>
            <CopyButton text={duaText} label="Copy Dua" />
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
