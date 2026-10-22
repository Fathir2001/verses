"use client";

import { formatIslamicDate, getCurrentOccasion, toIslamicDate } from "@/lib/islamicCalendar";
import { useEffect, useState } from "react";
import { GlassCard } from "./GlassCard";

export function IslamicDateBanner() {
  const [islamicDate, setIslamicDate] = useState("");
  const [gregorianDate, setGregorianDate] = useState("");
  const [occasion, setOccasion] = useState<Awaited<ReturnType<typeof getCurrentOccasion>>>(null);

  useEffect(() => {
    const now = new Date();
    let active = true;
    setGregorianDate(now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" }));
    async function loadDate() {
      try {
        const hijriDate = await toIslamicDate(now);
        if (active) setIslamicDate(formatIslamicDate(hijriDate));
        const currentOccasion = await getCurrentOccasion();
        if (active) setOccasion(currentOccasion);
      } catch {
        // The Gregorian date remains available when the calendar service is offline.
      }
    }
    loadDate();
    return () => { active = false; };
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-200 sm:text-sm" aria-label="Today's date">
        <span className="text-amber-600 dark:text-amber-300" aria-hidden="true">✦</span>
        {islamicDate && <span>{islamicDate}</span>}
        {islamicDate && <span className="hidden h-1 w-1 rounded-full bg-slate-400 sm:block" aria-hidden="true" />}
        <span className="text-slate-600 dark:text-slate-400">{gregorianDate}</span>
      </div>
      {occasion && (
        <GlassCard className="mx-auto max-w-2xl border-amber-400/30 px-4 py-3 text-center dark:border-amber-300/20">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{occasion.emoji} {occasion.name}</p>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{occasion.message}</p>
        </GlassCard>
      )}
    </div>
  );
}
