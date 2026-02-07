"use client";

import { AdminSidebar } from "@/components/AdminSidebar";
import { api, ApiError, Feeling } from "@/lib/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    feelings: 0,
    duas: 0,
    verses: 0,
  });
  const [recentFeelings, setRecentFeelings] = useState<Feeling[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feelingsRes, duasRes, versesRes] = await Promise.all([
          api.getAdminFeelings(1, 5),
          api.getAdminDuas(1, 1),
          api.getAdminVerses(1, 1),
        ]);

        setStats({
          feelings: feelingsRes.pagination?.totalItems || 0,
          duas: duasRes.pagination?.totalItems || 0,
          verses: versesRes.pagination?.totalItems || 0,
        });

        if (feelingsRes.data) {
          setRecentFeelings(feelingsRes.data);
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load dashboard data");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      label: "Feelings",
      value: stats.feelings,
      href: "/admin/feelings",
      icon: "😊",
      gradient: "from-emerald-400 via-teal-400 to-cyan-400",
      bgGlow: "bg-gradient-to-br from-emerald-500/30 to-teal-500/20",
      shadowColor: "shadow-emerald-500/25",
      borderGlow: "hover:border-emerald-400/50",
    },
    {
      label: "Duas",
      value: stats.duas,
      href: "/admin/duas",
      icon: "🤲",
      gradient: "from-blue-400 via-indigo-400 to-purple-400",
      bgGlow: "bg-gradient-to-br from-blue-500/30 to-indigo-500/20",
      shadowColor: "shadow-blue-500/25",
      borderGlow: "hover:border-blue-400/50",
    },
    {
      label: "Verses",
      value: stats.verses,
      href: "/admin/verses",
      icon: "📖",
      gradient: "from-purple-400 via-pink-400 to-rose-400",
      bgGlow: "bg-gradient-to-br from-purple-500/30 to-pink-500/20",
      shadowColor: "shadow-purple-500/25",
      borderGlow: "hover:border-purple-400/50",
    },
  ];

  const quickActions = [
    {
      href: "/admin/feelings/new",
      label: "Add Feeling",
      description: "Create a new feeling entry",
      icon: "😊",
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    },
    {
      href: "/admin/duas/new",
      label: "Add Dua",
      description: "Add a new supplication",
      icon: "🤲",
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
    },
    {
      href: "/admin/verses/new",
      label: "Add Verse",
      description: "Add Quran verses",
      icon: "📜",
      gradient: "from-purple-500 via-pink-500 to-rose-500",
    },
  ];

  return (
    <AdminSidebar>
      <div className="relative">
        {/* Ambient Background Effects — CSS only, no JS */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] animate-pulse [animation-delay:1s]" />
          <div className="absolute top-1/2 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-[90px] animate-pulse [animation-delay:2s]" />
        </div>

        {/* Header */}
        <div className="relative mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <span className="text-2xl">✨</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-slate-400 mt-1">
                Welcome to Think_Different content management
              </p>
            </div>
          </motion.div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-red-500/20 to-rose-500/10 border border-red-500/30 backdrop-blur-xl shadow-lg shadow-red-500/10"
          >
            <p className="text-red-300 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              {error}
            </p>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
            >
              <Link
                href={stat.href}
                className={`group relative block p-6 rounded-3xl backdrop-blur-2xl 
                          bg-gradient-to-br from-white/10 via-white/5 to-transparent
                          border border-white/10 ${stat.borderGlow}
                          hover:shadow-2xl ${stat.shadowColor}
                          transition-all duration-500 overflow-hidden`}
              >
                {/* Animated gradient background */}
                <div
                  className={`absolute inset-0 ${stat.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Shimmer effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                </div>

                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">
                      {stat.label}
                    </p>
                    <p className="text-5xl font-bold bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
                      {isLoading ? (
                        <span className="inline-block w-16 h-12 bg-white/10 rounded-xl animate-pulse" />
                      ) : (
                        stat.value
                      )}
                    </p>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} 
                              flex items-center justify-center shadow-xl ${stat.shadowColor}
                              transform transition-all duration-300`}
                  >
                    <span className="text-3xl">{stat.icon}</span>
                  </motion.div>
                </div>

                <div className="relative mt-6 flex items-center justify-between">
                  <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                    View all {stat.label.toLowerCase()}
                  </span>
                  <div className="flex items-center gap-2 text-slate-400 group-hover:text-white transition-colors">
                    <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore
                    </span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
              <span className="text-lg">⚡</span>
            </div>
            <h3 className="text-xl font-bold text-white">Quick Actions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Link
                  href={action.href}
                  className={`group relative flex items-center gap-4 p-5 rounded-2xl 
                            bg-gradient-to-r ${action.gradient}
                            hover:shadow-2xl hover:shadow-emerald-500/20 
                            transform hover:scale-[1.02] hover:-translate-y-1
                            transition-all duration-300 overflow-hidden`}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                  </div>

                  <div className="relative w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-2xl">{action.icon}</span>
                  </div>
                  <div className="relative flex-1">
                    <span className="font-semibold text-white block">
                      {action.label}
                    </span>
                    <span className="text-sm text-white/70">
                      {action.description}
                    </span>
                  </div>
                  <svg
                    className="relative w-6 h-6 text-white/80 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <span className="text-lg">📊</span>
            </div>
            <h3 className="text-xl font-bold text-white">Content Overview</h3>
          </div>

          <div className="p-6 rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  label: "Total Content Items",
                  value: stats.feelings + stats.duas + stats.verses,
                  icon: "📚",
                },
                { label: "Database Status", value: "Online", icon: "🟢" },
                { label: "Last Updated", value: "Just now", icon: "🕐" },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-sm text-slate-400">{item.label}</p>
                    <p className="text-lg font-semibold text-white">
                      {isLoading && typeof item.value === "number"
                        ? "..."
                        : item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AdminSidebar>
  );
}
