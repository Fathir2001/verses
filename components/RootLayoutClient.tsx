"use client";

import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { usePathname } from "next/navigation";

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <FavoritesProvider>
        {!isAdminRoute && <AnimatedBackground />}
        <div className="min-h-screen flex flex-col">
          {!isAdminRoute && <Navbar />}
          <main className="flex-grow">{children}</main>
          {!isAdminRoute && (
            <footer className="py-6 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-300 text-glow">
                Made with 💚 for the Ummah
              </p>
              <div className="flex items-center justify-center gap-2">
                <img
                  src="/enhanced_image.png"
                  alt="Think Different Logo"
                  className="w-6 h-6 object-contain"
                  loading="lazy"
                  decoding="async"
                />
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-400 text-glow">
                  © 2026 Think_Different
                </p>
              </div>
            </footer>
          )}
        </div>
      </FavoritesProvider>
    </ThemeProvider>
  );
}
