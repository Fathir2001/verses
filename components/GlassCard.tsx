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
        "bg-white dark:bg-slate-800",
        "backdrop-blur-xl",
        "border border-slate-200 dark:border-slate-700",
        "shadow-xl shadow-slate-300/50 dark:shadow-slate-900/70",
        "transition-transform transition-shadow duration-200 ease-out",
        hover &&
          "cursor-pointer hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]",
        glow &&
          "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-emerald-500/10 before:to-teal-500/10 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
