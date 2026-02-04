"use client";

import type { Feeling } from "@/types/feeling";
import { motion } from "framer-motion";
import Link from "next/link";
import { GlassCard } from "./GlassCard";

interface FeelingCardProps {
  feeling: Feeling;
  index: number;
}

export function FeelingCard({ feeling, index }: FeelingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: "easeOut",
      }}
    >
      <Link
        href={`/feelings/${feeling.slug}`}
        className="block focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded-3xl"
      >
        <GlassCard hover glow className="p-6 h-full group">
          <div className="flex flex-col h-full">
            <motion.span
              className="text-4xl mb-3"
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {feeling.emoji}
            </motion.span>

            <h2
              className="text-xl font-semibold text-slate-800 dark:text-white mb-2 
                           group-hover:text-emerald-600 dark:group-hover:text-emerald-400 
                           transition-colors duration-200"
            >
              {feeling.title}
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 flex-grow">
              {feeling.preview}
            </p>

            <div
              className="mt-4 flex items-center text-sm text-emerald-600 dark:text-emerald-400 
                            font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <span>Find comfort</span>
              <motion.svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </motion.svg>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}
