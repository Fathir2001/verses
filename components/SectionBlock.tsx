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
    <section className="animate-fade-in-up">
      <GlassCard className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-5 border-b border-slate-300/40 pb-4 dark:border-white/10">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-lg" aria-hidden="true">{icon}</span>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </h2>
        </div>
        <div className="text-slate-700 dark:text-slate-200">{children}</div>
      </GlassCard>
    </section>
  );
}
