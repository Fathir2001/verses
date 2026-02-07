import { GlassCard } from "@/components/GlassCard";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="max-w-md mx-auto">
        <GlassCard className="p-8 text-center">
          <span className="text-6xl block mb-4">🧭</span>

          <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-3">
            Page Not Found
          </h2>

          <p className="text-slate-600 dark:text-slate-300 mb-6">
            It seems you&apos;ve wandered off the path. Let&apos;s guide you
            back to comfort.
          </p>

          <Link
            href="/feelings"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl
                       bg-gradient-to-r from-emerald-500 to-teal-500
                       text-white font-medium shadow-lg shadow-emerald-500/25
                       hover:shadow-xl hover:shadow-emerald-500/30
                       transition-shadow duration-300"
          >
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go to Feelings
          </Link>
        </GlassCard>
      </div>
    </div>
  );
}
