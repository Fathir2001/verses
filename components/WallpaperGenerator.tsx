"use client";

import type { Feeling } from "@/types/feeling";
import { motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { GlassCard } from "./GlassCard";

interface WallpaperGeneratorProps {
  feeling: Feeling;
}

type WallpaperTheme = "mosque" | "mint" | "lavender" | "peach" | "sky" | "gold";

const themes: Record<
  WallpaperTheme,
  { overlay: string; textColor: string; name: string }
> = {
  mosque: {
    overlay: "rgba(255, 255, 255, 0.3)",
    textColor: "#1e293b",
    name: "Original",
  },
  mint: {
    overlay: "rgba(167, 243, 208, 0.5)",
    textColor: "#064e3b",
    name: "Mint",
  },
  lavender: {
    overlay: "rgba(221, 214, 254, 0.5)",
    textColor: "#4c1d95",
    name: "Lavender",
  },
  peach: {
    overlay: "rgba(254, 202, 202, 0.5)",
    textColor: "#9f1239",
    name: "Peach",
  },
  sky: {
    overlay: "rgba(186, 230, 253, 0.5)",
    textColor: "#0c4a6e",
    name: "Sky",
  },
  gold: {
    overlay: "rgba(253, 230, 138, 0.5)",
    textColor: "#78350f",
    name: "Gold",
  },
};

type ContentType = "verse" | "dua";

export function WallpaperGenerator({ feeling }: WallpaperGeneratorProps) {
  const [theme, setTheme] = useState<WallpaperTheme>("mosque");
  const [contentType, setContentType] = useState<ContentType>("verse");
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentTheme = themes[theme];

  const generateWallpaper = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGenerating(true);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size for mobile wallpaper (1080x1920)
    const width = 1080;
    const height = 1920;
    canvas.width = width;
    canvas.height = height;

    const currentThemeData = themes[theme];
    const textColor = currentThemeData.textColor;

    // Function to draw content after background is ready
    const drawContent = () => {
      // Apply colored overlay based on theme
      ctx.fillStyle = currentThemeData.overlay;
      ctx.fillRect(0, 0, width, height);

      // Set up text styling - use dark text for readability
      ctx.fillStyle = textColor;
      ctx.textAlign = "center";

      // Draw emoji
      ctx.font = "120px sans-serif";
      ctx.fillText(feeling.emoji, width / 2, height * 0.18);

      // Draw "I Am Feeling" title
      ctx.font = "bold 52px sans-serif";
      ctx.fillText(`I Am Feeling ${feeling.title}`, width / 2, height * 0.26);

      // Draw content based on type
      const content = contentType === "verse" ? feeling.quran : feeling.dua;
      const padding = 80;
      const maxWidth = width - padding * 2;

      // Arabic text
      if (
        (contentType === "verse" && feeling.quran.arabic) ||
        (contentType === "dua" && feeling.dua.arabic)
      ) {
        const arabicText =
          contentType === "verse" ? feeling.quran.arabic : feeling.dua.arabic;
        ctx.font = "56px sans-serif";
        ctx.textAlign = "right";

        // Word wrap for Arabic
        const arabicLines = wrapText(ctx, arabicText || "", maxWidth);
        let yPos = height * 0.38;
        arabicLines.forEach((line) => {
          ctx.fillText(line, width - padding, yPos);
          yPos += 80;
        });
        ctx.textAlign = "center";
      }

      // English translation or transliteration
      const englishText =
        contentType === "verse"
          ? feeling.quran.text
          : feeling.dua.transliteration;

      ctx.font = "italic 36px sans-serif";
      const englishLines = wrapText(ctx, `"${englishText}"`, maxWidth);
      let englishY = height * 0.55;
      englishLines.forEach((line) => {
        ctx.fillText(line, width / 2, englishY);
        englishY += 50;
      });

      // Meaning (for dua only)
      if (contentType === "dua") {
        ctx.font = "32px sans-serif";
        const meaningLines = wrapText(
          ctx,
          `"${feeling.dua.meaning}"`,
          maxWidth,
        );
        let meaningY = englishY + 40;
        meaningLines.forEach((line) => {
          ctx.fillText(line, width / 2, meaningY);
          meaningY += 45;
        });
      }

      // Reference
      ctx.font = "bold 28px sans-serif";
      ctx.fillStyle = textColor;
      const reference =
        contentType === "verse"
          ? feeling.quran.reference
          : feeling.dua.reference || "";
      ctx.fillText(`— ${reference}`, width / 2, height * 0.82);

      // App name watermark
      ctx.font = "bold 28px sans-serif";
      ctx.fillStyle = "rgba(16, 185, 129, 0.9)";
      ctx.fillText("I Am Feeling • Islamic Comfort", width / 2, height * 0.92);

      // Client branding
      ctx.font = "bold 28px sans-serif";
      ctx.fillStyle = textColor;
      ctx.fillText("© 2026 Think_Different", width / 2, height * 0.96);

      setIsGenerating(false);

      // Download the image
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `iamfeeling-${feeling.slug}-${contentType}-${theme}.png`;
      link.href = dataUrl;
      link.click();
    };

    // Always load the mosque image for all themes
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Draw the mosque background image
      ctx.drawImage(img, 0, 0, width, height);
      drawContent();
    };
    img.onerror = () => {
      // Fallback to light gradient if image fails
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#e0f2fe");
      gradient.addColorStop(0.5, "#f0fdf4");
      gradient.addColorStop(1, "#fef3c7");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      drawContent();
    };
    img.src = "/background.jpeg";
  }, [theme, contentType, feeling]);

  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        <span>🎨</span> Create Shareable Wallpaper
      </h3>

      <div className="space-y-4">
        {/* Content Type Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
            Content
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setContentType("verse")}
              className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors
                ${
                  contentType === "verse"
                    ? "bg-emerald-500 text-white"
                    : "bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                }`}
            >
              📖 Quran Verse
            </button>
            <button
              onClick={() => setContentType("dua")}
              className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors
                ${
                  contentType === "dua"
                    ? "bg-emerald-500 text-white"
                    : "bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                }`}
            >
              🤲 Dua
            </button>
          </div>
        </div>

        {/* Theme Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
            Theme
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(themes) as WallpaperTheme[]).map((themeKey) => (
              <motion.button
                key={themeKey}
                onClick={() => setTheme(themeKey)}
                className={`w-10 h-10 rounded-xl border-2 transition-all overflow-hidden relative
                  ${
                    theme === themeKey
                      ? "border-emerald-500 shadow-lg scale-110"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                style={{ 
                  backgroundImage: "url('/background.jpeg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                whileHover={{ scale: theme === themeKey ? 1.1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={themes[themeKey].name}
              >
                <div 
                  className="absolute inset-0" 
                  style={{ backgroundColor: themes[themeKey].overlay }}
                />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div
          className="aspect-[9/16] max-h-64 rounded-xl overflow-hidden relative"
          style={{
            backgroundImage: "url('/background.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Colored overlay */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: currentTheme.overlay }}
          />
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
            style={{ color: currentTheme.textColor }}
          >
            <span className="text-3xl mb-1">{feeling.emoji}</span>
            <p className="text-xs font-bold mb-2">
              I Am Feeling {feeling.title}
            </p>
            <p className="text-[8px] italic line-clamp-3">
              {contentType === "verse"
                ? `"${feeling.quran.text}"`
                : `"${feeling.dua.transliteration}"`}
            </p>
            <p className="text-[6px] mt-1 font-semibold">
              —{" "}
              {contentType === "verse"
                ? feeling.quran.reference
                : feeling.dua.reference}
            </p>
            <p className="text-[6px] mt-2 font-bold">
              © 2026 Think_Different
            </p>
          </div>
        </div>

        {/* Generate Button */}
        <motion.button
          onClick={generateWallpaper}
          disabled={isGenerating}
          className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500
                     text-white font-medium shadow-lg shadow-emerald-500/25
                     hover:shadow-xl hover:shadow-emerald-500/30
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-300 flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isGenerating ? (
            <>
              <svg
                className="animate-spin w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Generating...
            </>
          ) : (
            <>
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Wallpaper
            </>
          )}
        </motion.button>
      </div>

      {/* Hidden canvas for generation */}
      <canvas ref={canvasRef} className="hidden" />
    </GlassCard>
  );
}

// Helper function to wrap text
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}
