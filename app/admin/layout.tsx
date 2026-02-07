"use client";

import { AdminAuthProvider } from "@/context/AdminAuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen relative overflow-hidden">
        {/* Static gradient background — no JS animation overhead */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900" />

          {/* CSS-animated orbs (same visuals, zero JS cost) */}
          <div
            className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] animate-[drift_20s_ease-in-out_infinite]"
          />
          <div
            className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[100px] animate-[drift-reverse_25s_ease-in-out_2s_infinite]"
          />
          <div
            className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px] animate-[drift_18s_ease-in-out_4s_infinite] -translate-x-1/2 -translate-y-1/2"
          />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Subtle noise texture */}
          <div
            className="absolute inset-0 opacity-20 mix-blend-soft-light"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noise)"/%3E%3C/svg%3E")',
            }}
          />
        </div>

        {children}
      </div>
    </AdminAuthProvider>
  );
}
