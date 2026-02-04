"use client";

import { useFavorites } from "@/context/FavoritesContext";
import { motion } from "framer-motion";

interface FavoriteButtonProps {
  slug: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function FavoriteButton({
  slug,
  size = "md",
  showLabel = false,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(slug);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <motion.button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(slug);
      }}
      className={`${showLabel ? "px-3 py-1.5" : sizeClasses[size]} 
                  inline-flex items-center justify-center gap-1.5 rounded-xl
                  transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-rose-500/50
                  backdrop-blur-sm shadow-sm
                  ${
                    favorited
                      ? "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400"
                      : "bg-white/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                  }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <motion.svg
        className={iconSizes[size]}
        fill={favorited ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
        animate={favorited ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </motion.svg>
      {showLabel && (
        <span className="text-sm font-medium">
          {favorited ? "Saved" : "Save"}
        </span>
      )}
    </motion.button>
  );
}
