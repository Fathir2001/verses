"use client";

import { copyToClipboard, shareContent } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const [shared, setShared] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  const handleShare = async () => {
    const canShare = typeof navigator !== "undefined" && navigator.share;

    if (canShare) {
      const success = await shareContent({ title, text, url });
      if (success) {
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } else {
      // Fallback: copy URL
      const success = await copyToClipboard(url);
      if (success) {
        setShowFallback(true);
        setTimeout(() => setShowFallback(false), 2000);
      }
    }
  };

  return (
    <motion.button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium
                 rounded-xl bg-teal-100 dark:bg-teal-900/30 
                 text-teal-700 dark:text-teal-300
                 hover:bg-teal-200 dark:hover:bg-teal-900/50
                 border border-teal-200/50 dark:border-teal-700/30
                 transition-colors duration-200
                 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label="Share"
    >
      <AnimatePresence mode="wait">
        {shared || showFallback ? (
          <motion.span
            key="done"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {showFallback ? "Link copied!" : "Shared!"}
          </motion.span>
        ) : (
          <motion.span
            key="share"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Share
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
