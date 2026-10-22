"use client";

import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function GlassCard({
  children,
  className,
  hover = false,
  glow = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-3xl overflow-hidden",
        "bg-white/75 dark:bg-slate-900/70",
        "backdrop-blur-2xl backdrop-saturate-150",
        "border border-white/70 dark:border-white/15",
        "shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)] dark:shadow-[0_18px_55px_-24px_rgba(0,0,0,0.85)]",
        "transition-[transform,box-shadow,border-color] duration-200 ease-out",
        hover &&
          "cursor-pointer hover:-translate-y-1 hover:border-emerald-300/70 dark:hover:border-emerald-400/40 hover:shadow-[0_24px_55px_-22px_rgba(15,23,42,0.4)] active:translate-y-0",
        glow &&
          "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-emerald-500/10 before:to-transparent before:pointer-events-none",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
