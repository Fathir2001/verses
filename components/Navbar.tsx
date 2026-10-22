"use client";

import { useFavorites } from "@/context/FavoritesContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/feelings", label: "Feelings", icon: "heart" },
  { href: "/quotes", label: "Quotes", icon: "book" },
  { href: "/favorites", label: "Saved", icon: "bookmark" },
] as const;

function NavIcon({ icon }: { icon: (typeof links)[number]["icon"] }) {
  const path = {
    heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
    book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z",
    bookmark: "M6 3h12v18l-6-4-6 4V3Z",
  }[icon];

  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { favorites } = useFavorites();

  return (
    <nav className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-5" aria-label="Main navigation">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 rounded-[1.4rem] border border-white/60 bg-white/75 px-3 py-2.5 shadow-[0_12px_36px_-20px_rgba(15,23,42,0.55)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/15 dark:bg-slate-950/75 sm:px-5">
        <Link href="/feelings" className="flex min-w-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" aria-label="Think Different home">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
            <img src="/enhanced_image.png" alt="" className="h-6 w-6 object-contain" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold tracking-tight text-slate-900 dark:text-white sm:text-base">Think Different</span>
            <span className="hidden text-[10px] font-medium tracking-wide text-slate-600 dark:text-slate-400 sm:block">Islamic comfort & guidance</span>
          </span>
        </Link>

        <div className="order-3 flex w-full items-center gap-1 rounded-xl border border-white/50 bg-slate-900/5 p-1 dark:border-white/10 dark:bg-white/5 sm:order-none sm:w-auto">
          {links.map(({ href, label, icon }) => {
            const active = pathname === href || (href === "/feelings" && pathname.startsWith("/feelings/"));
            return (
              <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`relative flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors sm:flex-none sm:text-sm ${active ? "bg-white text-emerald-800 shadow-sm dark:bg-white/15 dark:text-emerald-200" : "text-slate-600 hover:bg-white/50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"}`}>
                <NavIcon icon={icon} />
                {label}
                {href === "/favorites" && favorites.length > 0 && <span className="rounded-full bg-emerald-500/15 px-1.5 text-[10px] text-emerald-800 dark:text-emerald-200">{favorites.length}</span>}
              </Link>
            );
          })}
        </div>

        <div className="ml-auto sm:ml-0"><ThemeToggle /></div>
      </div>
    </nav>
  );
}
