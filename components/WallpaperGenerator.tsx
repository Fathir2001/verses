"use client";

import type { Feeling } from "@/types/feeling";
import { motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { GlassCard } from "./GlassCard";

interface WallpaperGeneratorProps {
  feeling: Feeling;
}

type WallpaperImageKey =
  | "mosque-1"
  | "mosque-2"
  | "mosque-3"
  | "mosque-4"
  | "mosque-5"
  | "mosque-6"
  | "mosque-7"
  | "mosque-8";

const imageOptions: Record<WallpaperImageKey, { src: string; name: string }> = {
  "mosque-1": { src: "/image1.png", name: "Golden Dome" },
  "mosque-2": { src: "/image2.jpeg", name: "White Majesty" },
  "mosque-3": { src: "/image3.jpeg", name: "Dome of Rock" },
  "mosque-4": { src: "/image4.jpeg", name: "Sunset Minaret" },
  "mosque-5": { src: "/image5.jpeg", name: "Elegant Courtyard" },
  "mosque-6": { src: "/image6.jpeg", name: "Grand White" },
  "mosque-7": { src: "/image7.jpeg", name: "Blue Reflection" },
  "mosque-8": { src: "/background.jpeg", name: "Classic" },
};

type ContentType = "verse" | "dua";

export function WallpaperGenerator({ feeling }: WallpaperGeneratorProps) {
  const [imageKey, setImageKey] = useState<WallpaperImageKey>("mosque-8");
  const [contentType, setContentType] = useState<ContentType>("verse");
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentImage = imageOptions[imageKey];

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

    const textColor = "#f8fafc";

    // Function to draw content after background is ready
    const drawContent = () => {
      // Dark glassy overlay for text visibility (lighter to keep image visible)
      ctx.fillStyle = "rgba(2, 6, 23, 0.25)";
      ctx.fillRect(0, 0, width, height);

      // Glass panel behind text - smaller to show more background
      const panelWidth = width - 200;
      const panelHeight = height * 0.48;
      const panelX = (width - panelWidth) / 2;
      const panelY = height * 0.24;
      const panelRadius = 40;

      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
      ctx.shadowBlur = 22;
      ctx.fillStyle = "rgba(15, 23, 42, 0.42)";
      ctx.beginPath();
      ctx.roundRect(panelX, panelY, panelWidth, panelHeight, panelRadius);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Set up text styling - use dark text for readability
      ctx.fillStyle = textColor;
      ctx.textAlign = "center";

      // Draw emoji
      ctx.font = "160px sans-serif";
      ctx.fillText(feeling.emoji, width / 2, height * 0.12);

      // Draw "I Am Feeling" title
      ctx.font = "bold 72px sans-serif";
      ctx.fillText(`I Am Feeling ${feeling.title}`, width / 2, height * 0.19);

      // Draw content based on type
      const content = contentType === "verse" ? feeling.quran : feeling.dua;
      const padding = 60;
      const maxWidth = width - padding * 2;

      // Arabic text
      if (
        (contentType === "verse" && feeling.quran.arabic) ||
        (contentType === "dua" && feeling.dua.arabic)
      ) {
        const arabicText =
          contentType === "verse" ? feeling.quran.arabic : feeling.dua.arabic;
        ctx.font = "bold 64px sans-serif";
        ctx.textAlign = "right";

        // Word wrap for Arabic
        const arabicLines = wrapText(ctx, arabicText || "", maxWidth);
        let yPos = height * 0.3;
        arabicLines.forEach((line) => {
          ctx.fillText(line, width - padding, yPos);
          yPos += 90;
        });
        ctx.textAlign = "center";
      }

      // English translation or transliteration
      const englishText =
        contentType === "verse"
          ? feeling.quran.text
          : feeling.dua.transliteration;

      ctx.font = "italic bold 48px sans-serif";
      const englishLines = wrapText(ctx, `"${englishText}"`, maxWidth);
      let englishY = height * 0.58;
      englishLines.forEach((line) => {
        ctx.fillText(line, width / 2, englishY);
        englishY += 65;
      });

      // Meaning (for dua only)
      if (contentType === "dua") {
        ctx.font = "bold 42px sans-serif";
        const meaningLines = wrapText(
          ctx,
          `"${feeling.dua.meaning}"`,
          maxWidth,
        );
        let meaningY = englishY + 50;
        meaningLines.forEach((line) => {
          ctx.fillText(line, width / 2, meaningY);
          meaningY += 55;
        });
      }

      // Reference
      ctx.font = "bold 44px sans-serif";
      ctx.fillStyle = textColor;
      const reference =
        contentType === "verse"
          ? feeling.quran.reference
          : feeling.dua.reference || "";
      ctx.fillText(`— ${reference}`, width / 2, height * 0.8);

      // Client branding with dark glassy card background
      const brandingText = "© 2026 Think_Different";
      ctx.font = "bold 38px sans-serif";
      const brandingMetrics = ctx.measureText(brandingText);
      const brandingX = width / 2;
      const brandingY = height * 0.93;
      const cardPadding = 30;
      const cardWidth = brandingMetrics.width + cardPadding * 2;
      const cardHeight = 70;
      const cardRadius = 20;

      // Draw glassy card background
      ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
      ctx.beginPath();
      ctx.roundRect(
        brandingX - cardWidth / 2,
        brandingY - cardHeight / 2 - 10,
        cardWidth,
        cardHeight,
        cardRadius,
      );
      ctx.fill();

      // Draw border for glass effect
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw the text on top
      ctx.fillStyle = "#f8fafc";
      ctx.fillText(brandingText, brandingX, brandingY);

      setIsGenerating(false);

      // Download the image
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `Think-Different-${feeling.title}-${contentType}.png`;
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
    img.src = currentImage.src;
  }, [imageKey, contentType, feeling, currentImage.src]);

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

        {/* Image Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
            Background Image
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(imageOptions) as WallpaperImageKey[]).map((key) => (
              <motion.button
                key={key}
                onClick={() => setImageKey(key)}
                className={`w-10 h-10 rounded-xl border-2 transition-all overflow-hidden relative
                  ${
                    imageKey === key
                      ? "border-emerald-500 shadow-lg scale-110"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                style={{
                  backgroundImage: `url('${imageOptions[key].src}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                whileHover={{ scale: imageKey === key ? 1.1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={imageOptions[key].name}
              ></motion.button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div
          className="aspect-[9/16] max-h-64 rounded-xl overflow-hidden relative"
          style={{
            backgroundImage: `url('${currentImage.src}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-slate-950/20" />

          {/* Glassy text panel - smaller to show more background */}
          <div className="absolute inset-x-6 top-[25%] bottom-[25%] rounded-2xl bg-slate-900/35 border border-white/20 shadow-xl backdrop-blur-md" />

          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-50">
            <span className="text-3xl mb-1">{feeling.emoji}</span>
            <p className="text-xs font-bold mb-2">
              I Am Feeling {feeling.title}
            </p>
            <p className="text-[8px] italic line-clamp-3 text-slate-200">
              {contentType === "verse"
                ? `"${feeling.quran.text}"`
                : `"${feeling.dua.transliteration}"`}
            </p>
            <p className="text-[6px] mt-1 font-semibold text-slate-200">
              —{" "}
              {contentType === "verse"
                ? feeling.quran.reference
                : feeling.dua.reference}
            </p>
            <p className="text-[6px] mt-2 font-bold text-slate-100">
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
