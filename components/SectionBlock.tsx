"use client";

import { GlassCard } from "./GlassCard";

interface SectionBlockProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  delay?: number;
}

export function SectionBlock({ title, icon, children }: SectionBlockProps) {
  return (
    <div className="animate-fade-in-up">
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
            {title}
          </h3>
        </div>
        <div className="text-slate-700 dark:text-slate-200">{children}</div>
      </GlassCard>
    </div>
  );
}
