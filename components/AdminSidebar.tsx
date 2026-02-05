"use client";

import { useAdminAuth } from "@/context/AdminAuthContext";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AdminSidebarProps {
  children: React.ReactNode;
}

const navItems = [
  {
    name: "Dashboard",
    href: "/admin",
    emoji: "✨",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    name: "Feelings",
    href: "/admin/feelings",
    emoji: "😊",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    name: "Verses",
    href: "/admin/verses",
    emoji: "📖",
    gradient: "from-purple-400 to-pink-500",
  },
  {
    name: "Duas",
    href: "/admin/duas",
    emoji: "🤲",
    gradient: "from-blue-400 to-indigo-500",
  },
];

export function AdminSidebar({ children }: AdminSidebarProps) {
  const { admin, isLoading, isAuthenticated, logout } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-pulse">
            <span className="text-3xl">✨</span>
          </div>
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 blur-xl opacity-50 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 backdrop-blur-2xl bg-gradient-to-r from-white/5 to-transparent">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-emerald-500/20 ring-2 ring-white/10 group-hover:ring-emerald-500/50 transition-all">
            <img
              src="/enhanced_image.png"
              alt="Think_Different Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">
            Think_Different
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="p-2.5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-white hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
          aria-expanded={isSidebarOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={isMobile ? { x: isSidebarOpen ? 0 : -288 } : { x: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed md:static inset-y-0 left-0 z-[55] w-72 
                   backdrop-blur-2xl bg-gradient-to-b from-white/10 via-white/5 to-transparent
                   border-r border-white/10 flex flex-col 
                   -translate-x-full md:translate-x-0
                   ${isSidebarOpen ? "!translate-x-0" : ""}`}
      >
        {/* Decorative gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
        </div>

        {/* Logo + Close Button */}
        <div className="relative p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-12 h-12 rounded-2xl overflow-hidden shadow-xl shadow-emerald-500/30 ring-2 ring-white/20 group-hover:ring-emerald-500/50 transition-all"
              >
                <img
                  src="/enhanced_image.png"
                  alt="Think_Different Logo"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div>
                <h1 className="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors">
                  Think_Different
                </h1>
                <p className="text-xs text-slate-400">Content Management</p>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsSidebarOpen(false);
              }}
              className="md:hidden p-2.5 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-500/10 
                       border border-red-500/30 text-red-400 
                       hover:bg-red-500/30 hover:text-red-300 hover:shadow-lg hover:shadow-red-500/20
                       transition-all duration-300 relative z-[70]"
              aria-label="Close menu"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="relative p-4 flex-1">
          <p className="px-4 mb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
            Navigation
          </p>
          <ul className="space-y-2">
            {navItems.map((item, index) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <motion.li
                  key={item.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 overflow-hidden
                      ${
                        isActive
                          ? `bg-gradient-to-r ${item.gradient} shadow-lg`
                          : "hover:bg-white/5"
                      }`}
                  >
                    {/* Hover shimmer effect */}
                    {!isActive && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12" />
                      </div>
                    )}

                    <span
                      className={`relative text-xl transition-transform duration-300 ${isActive ? "" : "group-hover:scale-110"}`}
                    >
                      {item.emoji}
                    </span>
                    <span
                      className={`relative font-semibold transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`}
                    >
                      {item.name}
                    </span>

                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-2.5 h-2.5 rounded-full bg-white shadow-lg shadow-white/50"
                      />
                    )}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* Quick Actions */}
        <div className="relative p-4 border-t border-white/10">
          <p className="px-4 mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
            Quick Links
          </p>
          <Link
            href="/feelings"
            className="group flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-400 
                     hover:text-white hover:bg-gradient-to-r hover:from-white/10 hover:to-transparent
                     transition-all duration-300"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">
              🌐
            </span>
            <span className="font-semibold">View Website</span>
            <svg
              className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </Link>
        </div>

        {/* User section */}
        <div className="relative p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <span className="text-white font-bold text-lg">
                {admin?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {admin?.email}
              </p>
              <p className="text-xs text-emerald-400 capitalize font-medium">
                {admin?.role}
              </p>
            </div>
          </div>

          <motion.button
            onClick={logout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl
                     bg-gradient-to-r from-red-500/10 to-rose-500/5 
                     border border-red-500/20 hover:border-red-500/40
                     text-red-400 hover:text-red-300
                     hover:shadow-lg hover:shadow-red-500/10
                     transition-all duration-300"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="font-semibold">Sign Out</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 sm:p-6 lg:p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
