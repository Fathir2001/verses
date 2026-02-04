"use client";

import type { Feeling } from "@/types/feeling";
import { motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { GlassCard } from "./GlassCard";

interface WallpaperGeneratorProps {
  feeling: Feeling;
}

type WallpaperTheme = "emerald" | "ocean" | "sunset" | "night" | "rose";

const themes: Record<
  WallpaperTheme,
  { gradient: string; textColor: string; name: string }
> = {
  emerald: {
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
    textColor: "#ffffff",
    name: "Emerald",
  },
  ocean: {
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)",
    textColor: "#ffffff",
    name: "Ocean",
  },
  sunset: {
    gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
    textColor: "#ffffff",
    name: "Sunset",
  },
  night: {
    gradient: "linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%)",
    textColor: "#ffffff",
    name: "Night",
  },
  rose: {
    gradient: "linear-gradient(135deg, #f43f5e 0%, #e11d48 50%, #be123c 100%)",
    textColor: "#ffffff",
    name: "Rose",
  },
};

type ContentType = "verse" | "dua";

export function WallpaperGenerator({ feeling }: WallpaperGeneratorProps) {
  const [theme, setTheme] = useState<WallpaperTheme>("emerald");
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

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    if (theme === "emerald") {
      gradient.addColorStop(0, "#10b981");
      gradient.addColorStop(0.5, "#059669");
      gradient.addColorStop(1, "#047857");
    } else if (theme === "ocean") {
      gradient.addColorStop(0, "#0ea5e9");
      gradient.addColorStop(0.5, "#0284c7");
      gradient.addColorStop(1, "#0369a1");
    } else if (theme === "sunset") {
      gradient.addColorStop(0, "#f97316");
      gradient.addColorStop(0.5, "#ea580c");
      gradient.addColorStop(1, "#c2410c");
    } else if (theme === "night") {
      gradient.addColorStop(0, "#1e293b");
      gradient.addColorStop(0.5, "#0f172a");
      gradient.addColorStop(1, "#020617");
    } else if (theme === "rose") {
      gradient.addColorStop(0, "#f43f5e");
      gradient.addColorStop(0.5, "#e11d48");
      gradient.addColorStop(1, "#be123c");
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add subtle pattern overlay
    ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 100 + 50;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Set up text styling
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";

    // Draw emoji
    ctx.font = "120px sans-serif";
    ctx.fillText(feeling.emoji, width / 2, height * 0.2);

    // Draw "I Am Feeling" title
    ctx.font = "bold 48px sans-serif";
    ctx.fillText(`I Am Feeling ${feeling.title}`, width / 2, height * 0.28);

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
      let yPos = height * 0.4;
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
      const meaningLines = wrapText(ctx, `"${feeling.dua.meaning}"`, maxWidth);
      let meaningY = englishY + 40;
      meaningLines.forEach((line) => {
        ctx.fillText(line, width / 2, meaningY);
        meaningY += 45;
      });
    }

    // Reference
    ctx.font = "bold 28px sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    const reference =
      contentType === "verse"
        ? feeling.quran.reference
        : feeling.dua.reference || "";
    ctx.fillText(`— ${reference}`, width / 2, height * 0.85);

    // Watermark
    ctx.font = "24px sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillText("I Am Feeling • Islamic Comfort", width / 2, height * 0.95);

    setIsGenerating(false);

    // Download the image
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `iamfeeling-${feeling.slug}-${contentType}-${theme}.png`;
    link.href = dataUrl;
    link.click();
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
                className={`w-10 h-10 rounded-xl border-2 transition-all
                  ${
                    theme === themeKey
                      ? "border-white shadow-lg scale-110"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                style={{ background: themes[themeKey].gradient }}
                whileHover={{ scale: theme === themeKey ? 1.1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={themes[themeKey].name}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div
          className="aspect-[9/16] max-h-64 rounded-xl overflow-hidden relative"
          style={{ background: currentTheme.gradient }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white text-center">
            <span className="text-3xl mb-1">{feeling.emoji}</span>
            <p className="text-xs font-medium mb-2">
              I Am Feeling {feeling.title}
            </p>
            <p className="text-[8px] italic line-clamp-3 opacity-90">
              {contentType === "verse"
                ? `"${feeling.quran.text}"`
                : `"${feeling.dua.transliteration}"`}
            </p>
            <p className="text-[6px] mt-1 opacity-70">
              —{" "}
              {contentType === "verse"
                ? feeling.quran.reference
                : feeling.dua.reference}
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
